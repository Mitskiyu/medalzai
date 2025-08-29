use axum::{Json, extract::State, http::StatusCode};
use futures::future::join_all;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Semaphore;
use tokio::time::{Duration, timeout};
use tracing::error;

use crate::app::AppState;
use crate::services::medal::{process_url, validate_url};

#[derive(Deserialize)]
pub struct URLs {
    urls: Vec<String>,
}

#[derive(Serialize, Default)]
pub struct Metadata {
    pub username: String,
    pub title: String,
    pub game: String,
    pub date: String,
    pub url: String,
    pub thumbnail: String,
}

pub async fn get_metadata(
    State(state): State<AppState>,
    Json(payload): Json<URLs>,
) -> Result<(StatusCode, Json<Vec<Metadata>>), (StatusCode, String)> {
    let semaphore = Arc::new(Semaphore::new(10));

    let futures = payload.urls.iter().map(|url| {
        let client = state.metadata_client.clone();
        let url = url.clone();
        let semaphore = semaphore.clone();

        async move {
            if !validate_url(&url) {
                error!("Invalid url: {}", url);
                return Metadata::default();
            }

            let _permit = match semaphore.acquire().await {
                Ok(p) => p,
                Err(e) => {
                    error!("Semaphore error: {:}", e);
                    return Metadata::default();
                }
            };

            match process_url(&url, &client).await {
                Ok(metadata) => metadata,
                Err(e) => {
                    error!("Failed to process {}: {:}", url, e);
                    Metadata::default()
                }
            }
        }
    });

    let res = timeout(Duration::from_secs(30), join_all(futures))
        .await
        .map_err(|_| (StatusCode::REQUEST_TIMEOUT, "Request timed out".to_string()))?;

    Ok((StatusCode::OK, Json(res)))
}

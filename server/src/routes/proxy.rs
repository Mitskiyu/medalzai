use axum::{
    body::Body,
    extract::{Query, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
};
use futures::stream;
use serde::Deserialize;

use crate::app::AppState;

#[derive(Deserialize)]
pub struct VideoQuery {
    pub url: String,
}

pub async fn proxy_video(
    State(state): State<AppState>,
    Query(query): Query<VideoQuery>,
) -> impl IntoResponse {
    let resp = match state.proxy_client.get(&query.url).send().await {
        Ok(res) => res,
        Err(e) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Request failed: {}", e),
            )
                .into_response();
        }
    };

    let status = resp.status();

    let mut headers = HeaderMap::new();

    for (key, value) in resp.headers() {
        let key_str = key.as_str();

        if key_str == "cache-control"
            || key_str == "expires"
            || key_str == "pragma"
            || key_str == "etag"
            || key_str == "last-modified"
        {
            continue;
        }

        headers.insert(key.clone(), value.clone());
    }

    headers.insert(
        "cache-control",
        "no-store, no-cache, must-revalidate".parse().unwrap(),
    );
    headers.insert("pragma", "no-cache".parse().unwrap());
    headers.insert("expires", "0".parse().unwrap());

    let stream = stream::unfold(resp, |mut resp| async move {
        match resp.chunk().await {
            Ok(Some(chunk)) => Some((Ok(chunk), resp)),
            Ok(None) => None,
            Err(e) => Some((Err(std::io::Error::other(e)), resp)),
        }
    });

    (status, headers, Body::from_stream(stream)).into_response()
}

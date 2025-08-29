use axum::http::{HeaderValue, Method};
use axum::{
    Router,
    routing::{get, post},
};
use reqwest::header::{CONTENT_TYPE, ORIGIN};
use std::time::Duration;
use tower_http::cors::CorsLayer;

use crate::routes::{metadata::get_metadata, proxy::proxy_video};

#[derive(Clone)]
pub struct AppState {
    pub metadata_client: reqwest::Client,
    pub proxy_client: reqwest::Client,
}

pub fn create_app(origin: &str) -> Router {
    let state = AppState {
        metadata_client: reqwest::Client::builder()
            .timeout(Duration::from_secs(15))
            .pool_idle_timeout(Duration::from_secs(60))
            .pool_max_idle_per_host(10)
            .user_agent("Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36")
            .build()
            .expect("Metadata client failed to build"),
        proxy_client: reqwest::Client::builder()
            .timeout(Duration::from_secs(60))
            .connect_timeout(Duration::from_secs(10))
            .pool_idle_timeout(Duration::from_secs(30))
            .pool_max_idle_per_host(30)
            .no_gzip()
            .no_brotli()
            .no_deflate()
            .user_agent("Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36")
            .build()
            .expect("Proxy client failed to build"),
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([CONTENT_TYPE, ORIGIN])
        .allow_origin(
            origin
                .parse::<HeaderValue>()
                .expect("Invalid origin header"),
        );

    Router::new()
        .route("/metadata", post(get_metadata))
        .route("/proxy", get(proxy_video))
        .with_state(state)
        .layer(cors)
}

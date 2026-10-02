use crate::routes::proxy::is_allowed;
use crate::routes::{health::health_check, metadata::get_metadata, proxy::proxy_video};
use axum::http::{HeaderValue, Method};
use axum::{
    Router,
    routing::{get, post},
};
use reqwest::header::{CONTENT_TYPE, ORIGIN};
use rusqlite::Connection;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tower_http::cors::CorsLayer;

#[derive(Clone)]
pub struct AppState {
    pub metadata_client: reqwest::Client,
    pub proxy_client: reqwest::Client,
    pub stats: Arc<Mutex<Connection>>,
}

pub fn create_app(origin: &str) -> Router {
    let path = std::env::var("SQLITE").unwrap_or_else(|_| "stats.db".to_string());
    let conn = Connection::open(&path).expect("failed to open sqlite");
    conn.execute(
        "CREATE TABLE IF NOT EXISTS daily_clips (day TEXT PRIMARY KEY, clips INTEGER NOT NULL)",
        [],
    )
    .expect("failed to create table");

    let state = AppState {
        metadata_client: reqwest::Client::builder()
            .timeout(Duration::from_secs(15))
            .connect_timeout(Duration::from_secs(5))
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
            .redirect(reqwest::redirect::Policy::custom(|attempt| {
                if attempt.previous().len() < 5 && is_allowed(attempt.url().as_str()) {
                    attempt.follow()
                } else {
                    attempt.stop()
                }
            }))
            .user_agent("Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36")
            .build()
            .expect("Proxy client failed to build"),
        stats: Arc::new(Mutex::new(conn))
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([CONTENT_TYPE, ORIGIN])
        .allow_origin(
            origin
                .parse::<HeaderValue>()
                .unwrap_or_else(|_| panic!("origin is not valid: {}", origin)),
        );

    Router::new()
        .route("/health", get(health_check))
        .route("/metadata", post(get_metadata))
        .route("/proxy", get(proxy_video))
        .with_state(state)
        .layer(cors)
}

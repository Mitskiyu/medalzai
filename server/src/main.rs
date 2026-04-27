use dotenv::from_path;
use tracing::{error, info, warn};

mod app;
mod routes;
mod services;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    if from_path("../.env").is_err() {
        warn!("no env file found, using defaults")
    }

    let origin = std::env::var("ORIGIN").expect("origin not set");
    let port = std::env::var("ADDR").unwrap_or_else(|_| "3000".to_string());

    info!("Starting server...");
    let app = app::create_app(&origin);

    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .expect(&format!("failed to bind to port: {}", port));
    info!("Server running on 0.0.0.0:{}", port);

    if let Err(e) = axum::serve(listener, app).await {
        error!("error: {:#?}", e);
    }
}

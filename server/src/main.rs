use dotenv::dotenv;
use tracing::{error, info};

mod app;
mod routes;
mod services;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    dotenv().ok();
    let origin = std::env::var("ALLOWED_ORIGINS").expect("No origins variable found");

    info!("Starting server...");
    let app = app::create_app(&origin);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("Failed to bind");
    info!("Server running on 0.0.0.0:3000");

    if let Err(e) = axum::serve(listener, app).await {
        error!("Server error: {:?}", e);
    }
}

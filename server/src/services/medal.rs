#![allow(dead_code)]
use chrono::DateTime;
use reqwest;
use serde::{Deserialize, ser::Error};
use serde_json;
use std::collections::HashMap;

use crate::routes::metadata::Metadata;

#[derive(Deserialize)]
struct HydrationData {
    clips: HashMap<String, ClipData>,
}

#[derive(Deserialize)]
struct PosterData {
    #[serde(rename = "displayName")]
    display_name: String,
}

#[derive(Deserialize)]
struct CategoryData {
    #[serde(rename = "categoryName")]
    category_name: String,
}

#[derive(Deserialize)]
struct ClipData {
    poster: PosterData,
    category: CategoryData,
    #[serde(rename = "contentTitle")]
    content_title: String,
    #[serde(rename = "contentUrl")]
    content_url: String,
    #[serde(rename = "thumbnailUrl")]
    thumbnail_url: String,
    created: i64,
}

pub async fn process_url(url: &str, client: &reqwest::Client) -> Result<Metadata, String> {
    let html = get_html(url, client)
        .await
        .map_err(|e| format!("failed to get html for: {}, {}", url, e))?;

    let hydration_data = extract_hydration_data(&html)?;

    let metadata = parse_hydration_data(&hydration_data)
        .map_err(|e| format!("failed to parse hydration data: {}", e))?;

    Ok(metadata)
}

pub async fn get_html(url: &str, client: &reqwest::Client) -> Result<String, reqwest::Error> {
    client.get(url).send().await?.text().await
}

pub fn extract_hydration_data(html: &str) -> Result<String, &str> {
    let prefix = "var hydrationData=";
    let prefix_end = html.find(prefix).ok_or("failed to find hydrationData")? + prefix.len();
    let json_len = html[prefix_end..]
        .find("</script>")
        .ok_or("failed to find closing script tag")?;

    Ok(html[prefix_end..prefix_end + json_len].to_string())
}

pub fn parse_hydration_data(hydration_data: &str) -> Result<Metadata, serde_json::Error> {
    let hd: HydrationData = serde_json::from_str(hydration_data)?;

    let (_clip_id, clip_data) = hd
        .clips
        .into_iter()
        .next()
        .ok_or_else(|| serde_json::Error::custom("no clips found in hydrationData"))?;

    let date = DateTime::from_timestamp(clip_data.created, 0)
        .ok_or_else(|| serde_json::Error::custom("failed to convert datetime from epoch"))?
        .to_string();

    Ok(Metadata {
        username: clip_data.poster.display_name,
        title: clip_data.content_title,
        game: clip_data.category.category_name,
        date,
        url: clip_data.content_url,
        thumbnail: clip_data.thumbnail_url,
    })
}

pub fn validate_url(url: &str) -> bool {
    let prefix = "https://medal.tv/";

    url.starts_with(prefix) && url.len() > prefix.len()
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevelopmentNotice from "@/components/DevelopmentNotice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Heart, ShoppingBag, Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { handicrafts, generateItemId } from "@/data/marketplaceData";
import dokraElephant from "@/assets/dokra-elephant.jpg";

const Marketplace = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handicrafts = [
    {
      name: "Dokra Art Elephant",
      artist: "Sunil Mahto",
      price: "₹2850",
      category: "metal-art",
      rating: 4.9,
      image: dokraElephant,
      description: "Handcrafted brass elephant using traditional Dokra lost-wax casting technique, passed down through generations.",
      artisan: "Verified Artisan",
      delivery: "7-10 days"
    },
    {
      name: "Paitkar Painting Scroll",
      artist: "Rani Devi",
      price: "₹1800", 
      category: "folk-art",
      rating: 4.8,
      image: dokraElephant, // Reusing for demo
      description: "Traditional narrative scroll painting depicting tribal folklore and mythological stories of Jharkhand.",
      artisan: "Master Craftsperson",
      delivery: "5-7 days"
    },
    {
      name: "Tribal Bamboo Basket Set",
      artist: "Mangal Oraon",
      price: "₹1200",
      category: "basketry",
      rating: 4.6,
      image: dokraElephant, // Reusing for demo  
      description: "Eco-friendly bamboo baskets woven using traditional techniques, perfect for home organization.",
      artisan: "Certified Weaver", 
      delivery: "3-5 days"
    },
    // PAKUR DISTRICT MARKETPLACES
    {
      name: "Haatpara Market Crafts",
      artist: "Haatpara Artisans",
      price: "₹800",
      category: "others",
      rating: 4.2,
      image: dokraElephant,
      description: "Traditional handicrafts and local products from the vibrant Haatpara Market in Pakur.",
      artisan: "Market Collective",
      delivery: "5-7 days"
    },
    {
      name: "Harindanga Bazar Specialties",
      artist: "Harindanga Vendors",
      price: "₹600",
      category: "textiles",
      rating: 4.0,
      image: dokraElephant,
      description: "Quality textiles and handicrafts from the bustling Harindanga Bazar marketplace.",
      artisan: "Bazar Vendors",
      delivery: "7-10 days"
    },
    {
      name: "Krishna Plaza Collections",
      artist: "Krishna Plaza Merchants",
      price: "₹950",
      category: "others",
      rating: 4.3,
      image: dokraElephant,
      description: "Modern and traditional crafts from Krishna Plaza shopping center in Pakur.",
      artisan: "Plaza Collective",
      delivery: "5-8 days"
    },
    {
      name: "Padmani Chowk Market Items",
      artist: "Padmani Chowk Traders",
      price: "₹1200",
      category: "tribal-art",
      rating: 4.4,
      image: dokraElephant,
      description: "Authentic local handicrafts from the popular Padmani Chowk marketplace.",
      artisan: "Chowk Artisans",
      delivery: "4-6 days"
    },
    {
      name: "Hajrat Ali Market Products",
      artist: "Hajrat Ali Vendors",
      price: "₹750",
      category: "others",
      rating: 4.1,
      image: dokraElephant,
      description: "Traditional crafts and local specialties from Hajrat Ali market area.",
      artisan: "Market Vendors",
      delivery: "6-8 days"
    },
    {
      name: "Barkiyari Market Crafts",
      artist: "Barkiyari Artisans",
      price: "₹850",
      category: "others",
      rating: 4.2,
      image: dokraElephant,
      description: "Handcrafted items and local products from Barkiyari Market in Pakur district.",
      artisan: "Local Craftsmen",
      delivery: "5-7 days"
    },
    {
      name: "Bazaar Apke Duar Collection",
      artist: "Bazaar Apke Duar Pvt Ltd",
      price: "₹1100",
      category: "others",
      rating: 4.3,
      image: dokraElephant,
      description: "Curated handicrafts and local products from Bazaar Apke Duar Pvt Ltd marketplace.",
      artisan: "Corporate Vendors",
      delivery: "3-5 days"
    },
    // PALAMU DISTRICT MARKETPLACES
    {
      name: "City Market Crafts",
      artist: "City Market Vendors",
      price: "₹1200",
      category: "wood-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Urban handicrafts and local products from the main City Market in Palamu district.",
      artisan: "City Artisans",
      delivery: "6-8 days"
    },
    {
      name: "Bedani More Market Specialties",
      artist: "Bedani More Traders",
      price: "₹900",
      category: "textiles",
      rating: 4.1,
      image: dokraElephant,
      description: "Traditional textiles and crafts from the popular Bedani More Market area.",
      artisan: "More Vendors",
      delivery: "7-10 days"
    },
    {
      name: "Gopal Market Collections",
      artist: "Gopal Market Artisans",
      price: "₹1100",
      category: "rural-products",
      rating: 4.2,
      image: dokraElephant,
      description: "Authentic rural crafts and specialty items from Gopal Market in Palamu.",
      artisan: "Market Collective",
      delivery: "5-8 days"
    },
    {
      name: "Prem Sagar Market Items",
      artist: "Prem Sagar Vendors",
      price: "₹950",
      category: "forest-products",
      rating: 4.4,
      image: dokraElephant,
      description: "Eco-friendly products and handicrafts from Prem Sagar Market near forest areas.",
      artisan: "Forest Communities",
      delivery: "6-9 days"
    },
    {
      name: "Kushwaha Market Products",
      artist: "Kushwaha Market Guild",
      price: "₹800",
      category: "local-crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Local handicrafts and traditional items from Kushwaha Market in Palamu.",
      artisan: "Guild Artisans",
      delivery: "7-10 days"
    },
    {
      name: "Hisra Barwadih Bazar Crafts",
      artist: "Hisra Barwadih Vendors",
      price: "₹1300",
      category: "cooperative-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Community-made handicrafts from Hisra Barwadih Bazar supporting local artisans.",
      artisan: "Community Cooperative",
      delivery: "4-6 days"
    },
    // RAMGARH DISTRICT MARKETPLACES  
    {
      name: "Katiya Chowk Market",
      artist: "Katiya Chowk Vendors",
      price: "₹1100",
      category: "urban-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Contemporary and traditional crafts from the busy Katiya Chowk marketplace in Ramgarh.",
      artisan: "Chowk Artisans",
      delivery: "3-5 days"
    },
    {
      name: "Birsa Market Specialties",
      artist: "Birsa Market Guild",
      price: "₹950",
      category: "local-specialties",
      rating: 4.3,
      image: dokraElephant,
      description: "Unique local handicrafts and specialty items from the famous Birsa Market.",
      artisan: "Market Guild",
      delivery: "4-6 days"
    },
    {
      name: "Balsagra Bazar Crafts",
      artist: "Balsagra Craftsmen",
      price: "₹850",
      category: "village-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Authentic village handicrafts from Balsagra Bazar showcasing rural artistry.",
      artisan: "Village Artisans",
      delivery: "5-7 days"
    },
    {
      name: "Sanichra Market Products",
      artist: "Sanichra Vendors",
      price: "₹1200",
      category: "traditional-crafts",
      rating: 4.4,
      image: dokraElephant,
      description: "Traditional crafts and local products from Sanichra Market in Ramgarh district.",
      artisan: "Traditional Craftsmen",
      delivery: "4-6 days"
    },
    {
      name: "Mangal Bazaar Collections",
      artist: "Mangal Bazaar Traders",
      price: "₹1050",
      category: "bazaar-goods",
      rating: 4.2,
      image: dokraElephant,
      description: "Diverse handicrafts and local goods from the vibrant Mangal Bazaar marketplace.",
      artisan: "Bazaar Collective",
      delivery: "3-5 days"
    },
    {
      name: "Tudu Market Items",
      artist: "Tudu Market Artisans",
      price: "₹900",
      category: "community-crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Community-made handicrafts and local specialties from Tudu Market area.",
      artisan: "Community Artists",
      delivery: "5-8 days"
    },
    // RANCHI DISTRICT MARKETPLACES
    {
      name: "Ranchi Main Road Market",
      location: "Ranchi Main Road",
      artist: "Main Road Vendors",
      price: "₹1500",
      category: "urban-handicrafts",
      rating: 4.5,
      image: dokraElephant,
      description: "Premium handicrafts from Ranchi Main Road Market featuring diverse local artisan work.",
      artisan: "Certified Urban Artists",
      delivery: "2-4 days"
    },
    {
      name: "Bahu Bazaar Market",
      location: "Ranchi",
      artist: "Bahu Bazaar Traders",
      price: "₹1200",
      category: "traditional-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Traditional handicrafts and local products from the famous Bahu Bazaar Market.",
      artisan: "Bazaar Guild",
      delivery: "3-5 days"
    },
    {
      name: "Muri Bazar Specialties",
      location: "Ranchi",
      artist: "Muri Bazar Vendors",
      price: "₹900",
      category: "rural-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Rural handicrafts and specialty items from Muri Bazar marketplace.",
      artisan: "Rural Artisans",
      delivery: "4-6 days"
    },
    {
      name: "Hatia Chowk Market",
      location: "Ranchi",
      artist: "Hatia Chowk Artisans",
      price: "₹1100",
      category: "local-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Local handicrafts and artisan products from bustling Hatia Chowk market area.",
      artisan: "Chowk Collective",
      delivery: "3-5 days"
    },
    {
      name: "Kedar Market Collections",
      location: "Ranchi",
      artist: "Kedar Market Guild",
      price: "₹1300",
      category: "commercial-crafts",
      rating: 4.4,
      image: dokraElephant,
      description: "Commercial handicrafts and traditional items from Kedar Market in Ranchi.",
      artisan: "Market Guild",
      delivery: "2-4 days"
    },
    {
      name: "Naaz Market Products",
      location: "Ranchi",
      artist: "Naaz Market Vendors",
      price: "₹1050",
      category: "fashion-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Fashion-oriented handicrafts and accessories from Naaz Market.",
      artisan: "Fashion Artisans",
      delivery: "3-5 days"
    },
    {
      name: "Khajanchi Market Items",
      location: "Ranchi",
      artist: "Khajanchi Traders",
      price: "₹950",
      category: "jewelry-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Traditional jewelry and metalwork from Khajanchi Market specializing in precious items.",
      artisan: "Jewelry Craftsmen",
      delivery: "4-6 days"
    },
    {
      name: "Munna Market Specialties",
      location: "Ranchi",
      artist: "Munna Market Collective",
      price: "₹800",
      category: "local-specialties",
      rating: 4.0,
      image: dokraElephant,
      description: "Local specialty handicrafts and unique items from Munna Market area.",
      artisan: "Local Specialists",
      delivery: "5-7 days"
    },
    {
      name: "Mall of Ranchi Collections",
      location: "Ranchi",
      artist: "Mall Artisan Stores",
      price: "₹2200",
      category: "premium-crafts",
      rating: 4.6,
      image: dokraElephant,
      description: "Premium handicrafts and modern artisan collections from Mall of Ranchi.",
      artisan: "Premium Artists",
      delivery: "1-3 days"
    },
    // DEOGHAR DISTRICT MARKETPLACES
    {
      name: "Temple Market Crafts",
      location: "Deoghar",
      artist: "Temple Artisans",
      price: "₹800",
      category: "Religious Crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Religious handicrafts and souvenirs from markets around Baidyanath Temple.",
      artisan: "Temple Craft Guild",
      delivery: "4-6 days"
    },
    {
      name: "Baidyanath Temple Souvenirs",
      location: "Deoghar",
      artist: "Temple Vendors",
      price: "₹600",
      category: "Religious Items",
      rating: 4.2,
      image: dokraElephant,
      description: "Sacred souvenirs and religious items from the famous Baidyanath Temple complex.",
      artisan: "Temple Licensed Vendors",
      delivery: "5-8 days"
    },
    {
      name: "Deoghar Handicraft Emporium",
      location: "Deoghar",
      artist: "Government Emporium",
      price: "₹1400",
      category: "Government Crafts",
      rating: 4.5,
      image: dokraElephant,
      description: "Certified handicrafts from government emporium featuring authentic local artisan work.",
      artisan: "Government Certified",
      delivery: "3-5 days"
    },
    {
      name: "Local Artisan Quarter Products",
      location: "Deoghar",
      artist: "Artisan Quarter",
      price: "₹1100",
      category: "Quarter Crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Traditional crafts from the local artisan quarter showcasing diverse skills.",
      artisan: "Quarter Collective",
      delivery: "4-7 days"
    },
    // DHANBAD DISTRICT MARKETPLACES
    {
      name: "City Centre Market Crafts",
      location: "Dhanbad",
      artist: "City Centre Vendors",
      price: "₹1200",
      category: "Urban Crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Modern and traditional handicrafts from Dhanbad's bustling city centre markets.",
      artisan: "Urban Craft Collective",
      delivery: "3-5 days"
    },
    {
      name: "Jharia Market Specialties",
      location: "Dhanbad",
      artist: "Jharia Artisans",
      price: "₹950",
      category: "Mining Region Crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Unique crafts from Jharia area reflecting the mining heritage and local culture.",
      artisan: "Mining Community Artists",
      delivery: "5-7 days"
    },
    {
      name: "Sindri Industrial Crafts",
      location: "Dhanbad",
      artist: "Industrial Workers",
      price: "₹800",
      category: "Industrial Crafts",
      rating: 3.9,
      image: dokraElephant,
      description: "Creative handicrafts made by industrial workers using recycled materials.",
      artisan: "Worker Cooperatives",
      delivery: "6-8 days"
    },
    {
      name: "Dhanbad Local Bazaar",
      location: "Dhanbad",
      artist: "Bazaar Merchants",
      price: "₹700",
      category: "Bazaar Goods",
      rating: 4.1,
      image: dokraElephant,
      description: "Diverse handicrafts and local products from traditional bazaars of Dhanbad.",
      artisan: "Bazaar Guild",
      delivery: "4-6 days"
    },
    // DUMKA DISTRICT MARKETPLACES
    {
      name: "Santhal Tribal Market",
      location: "Dumka",
      artist: "Santhal Artisans",
      price: "₹1500",
      category: "Tribal Handicrafts",
      rating: 4.6,
      image: dokraElephant,
      description: "Authentic Santhal tribal handicrafts from the heartland of Santhal Pargana region.",
      artisan: "Santhal Master Craftsmen",
      delivery: "5-8 days"
    },
    {
      name: "Dumka Main Market",
      location: "Dumka",
      artist: "Main Market Vendors",
      price: "₹900",
      category: "Central Market",
      rating: 4.2,
      image: dokraElephant,
      description: "Central market handicrafts representing the diverse cultural heritage of Dumka.",
      artisan: "Market Association",
      delivery: "4-6 days"
    },
    {
      name: "Village Haat Products",
      location: "Dumka",
      artist: "Village Vendors",
      price: "₹650",
      category: "Village Haat",
      rating: 4.0,
      image: dokraElephant,
      description: "Traditional haat market products from villages around Dumka district.",
      artisan: "Village Collectives",
      delivery: "7-10 days"
    },
    {
      name: "Tribal Heritage Centre",
      location: "Dumka",
      artist: "Heritage Centre",
      price: "₹1800",
      category: "Heritage Crafts",
      rating: 4.7,
      image: dokraElephant,
      description: "Premium tribal heritage crafts from the cultural centre showcasing centuries-old traditions.",
      artisan: "Heritage Certified Masters",
      delivery: "3-5 days"
    },
    {
      name: "Craft Cooperative Society",
      location: "Dumka",
      artist: "Cooperative Society",
      price: "₹1300",
      category: "Cooperative Crafts",
      rating: 4.4,
      image: dokraElephant,
      description: "Cooperative society handicrafts supporting local artisan communities and fair trade.",
      artisan: "Society Members",
      delivery: "4-7 days"
    },
    {
      name: "Women's Self Help Group Crafts",
      location: "Dumka",
      artist: "Women's SHG",
      price: "₹1100",
      category: "Women's Crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Beautiful handicrafts created by women's self-help groups promoting economic empowerment.",
      artisan: "Women Artisans",
      delivery: "5-8 days"
    },
    // EAST SINGHBHUM DISTRICT MARKETPLACES
    {
      name: "Steel City Craft Market",
      location: "Jamshedpur",
      artist: "Steel City Artisans",
      price: "₹1600",
      category: "Industrial Crafts",
      rating: 4.4,
      image: dokraElephant,
      description: "Modern handicrafts incorporating steel city industrial themes with traditional techniques.",
      artisan: "Industrial City Artists",
      delivery: "3-5 days"
    },
    {
      name: "Bistupur Market Specialties",
      location: "Jamshedpur",
      artist: "Bistupur Vendors",
      price: "₹1200",
      category: "Urban Market",
      rating: 4.2,
      image: dokraElephant,
      description: "Urban market handicrafts from the popular Bistupur shopping area.",
      artisan: "Urban Market Collective",
      delivery: "4-6 days"
    },
    {
      name: "Sakchi Bazaar Crafts",
      location: "Jamshedpur",
      artist: "Sakchi Artisans",
      price: "₹950",
      category: "Bazaar Crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Traditional bazaar crafts from the historic Sakchi area of Jamshedpur.",
      artisan: "Sakchi Craft Guild",
      delivery: "5-7 days"
    },
    {
      name: "Adityapur Industrial Crafts",
      location: "Jamshedpur",
      artist: "Adityapur Workers",
      price: "₹800",
      category: "Industrial Zone",
      rating: 3.9,
      image: dokraElephant,
      description: "Creative crafts made by industrial workers using recycled and repurposed materials.",
      artisan: "Industrial Cooperatives",
      delivery: "6-8 days"
    },
    {
      name: "Tatanagar Railway Market",
      location: "Jamshedpur",
      artist: "Railway Vendors",
      price: "₹700",
      category: "Railway Market",
      rating: 4.0,
      image: dokraElephant,
      description: "Unique handicrafts and souvenirs from the bustling Tatanagar railway station market.",
      artisan: "Railway Market Association",
      delivery: "7-10 days"
    },
    {
      name: "Jugsalai Local Market",
      location: "Jamshedpur",
      artist: "Jugsalai Craftsmen",
      price: "₹1100",
      category: "Local Market",
      rating: 4.2,
      image: dokraElephant,
      description: "Local market crafts from Jugsalai area featuring community-made products.",
      artisan: "Community Craftsmen",
      delivery: "4-6 days"
    },
    // GARHWA DISTRICT MARKETPLACES
    {
      name: "Garhwa Tribal Market",
      location: "Garhwa",
      artist: "Garhwa Tribal Artists",
      price: "₹1300",
      category: "Tribal Market",
      rating: 4.3,
      image: dokraElephant,
      description: "Authentic tribal handicrafts from Garhwa district showcasing local tribal artistry.",
      artisan: "Tribal Craft Collective",
      delivery: "6-9 days"
    },
    {
      name: "Forest Products Market",
      location: "Garhwa",
      artist: "Forest Community",
      price: "₹900",
      category: "Forest Products",
      rating: 4.1,
      image: dokraElephant,
      description: "Sustainable forest products and crafts made by forest-dwelling communities.",
      artisan: "Forest Dwellers Cooperative",
      delivery: "8-12 days"
    },
    {
      name: "Garhwa Weekly Haat",
      location: "Garhwa",
      artist: "Haat Vendors",
      price: "₹650",
      category: "Weekly Market",
      rating: 3.9,
      image: dokraElephant,
      description: "Traditional weekly haat market products including crafts and local specialties.",
      artisan: "Haat Vendor Association",
      delivery: "10-14 days"
    },
    {
      name: "Rural Craft Centre",
      location: "Garhwa",
      artist: "Rural Artisans",
      price: "₹1100",
      category: "others",
      rating: 4.2,
      image: dokraElephant,
      description: "Rural craft centre products supporting local artisan communities and traditional skills.",
      artisan: "Rural Development Cooperative",
      delivery: "5-8 days"
    },
    // GIRIDIH DISTRICT MARKETPLACES
    {
      name: "Giridih Main Bazaar",
      location: "Giridih",
      artist: "Bazaar Merchants",
      price: "₹1000",
      category: "Main Bazaar",
      rating: 4.0,
      image: dokraElephant,
      description: "Central bazaar handicrafts representing the diverse cultural heritage of Giridih.",
      artisan: "Bazaar Merchants Guild",
      delivery: "4-6 days"
    },
    {
      name: "Mica Mining Crafts",
      location: "Giridih",
      artist: "Mining Community",
      price: "₹1200",
      category: "Mining Heritage",
      rating: 4.1,
      image: dokraElephant,
      description: "Unique crafts inspired by the mica mining heritage of Giridih region.",
      artisan: "Mining Community Artists",
      delivery: "5-7 days"
    },
    {
      name: "Parasnath Hill Souvenirs",
      location: "Giridih",
      artist: "Hill Vendors",
      price: "₹800",
      category: "Religious Crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Religious and spiritual handicrafts from the sacred Parasnath Hill area.",
      artisan: "Hill Shrine Vendors",
      delivery: "6-8 days"
    },
    {
      name: "Local Artisan Workshop",
      location: "Giridih",
      artist: "Workshop Collective",
      price: "₹1300",
      category: "others",
      rating: 4.3,
      image: dokraElephant,
      description: "Professional handicrafts from established artisan workshops in Giridih.",
      artisan: "Workshop Master Craftsmen",
      delivery: "3-5 days"
    },
    // GODDA DISTRICT MARKETPLACES
    {
      name: "Godda District Market",
      location: "Godda",
      artist: "District Artisans",
      price: "₹950",
      category: "District Market",
      rating: 4.0,
      image: dokraElephant,
      description: "District-wide handicrafts representing diverse communities and traditions of Godda.",
      artisan: "District Craft Alliance",
      delivery: "5-7 days"
    },
    {
      name: "Ganges Riverside Crafts",
      location: "Godda",
      artist: "Riverside Artisans",
      price: "₹1100",
      category: "Riverside Crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Handicrafts inspired by life along the Ganges river with water-themed designs.",
      artisan: "Riverside Communities",
      delivery: "6-8 days"
    },
    {
      name: "Traditional Craft Cooperative",
      location: "Godda",
      artist: "Craft Cooperative",
      price: "₹1250",
      category: "Cooperative",
      rating: 4.3,
      image: dokraElephant,
      description: "Cooperative-produced handicrafts supporting traditional artisan communities.",
      artisan: "Traditional Cooperative",
      delivery: "4-6 days"
    },
    // GUMLA DISTRICT MARKETPLACES
    {
      name: "Gumla Tribal Heritage Market",
      location: "Gumla",
      artist: "Tribal Heritage Guild",
      price: "₹1400",
      category: "Tribal Heritage",
      rating: 4.4,
      image: dokraElephant,
      description: "Premium tribal heritage crafts showcasing the rich cultural traditions of Gumla.",
      artisan: "Heritage Master Craftsmen",
      delivery: "3-5 days"
    },
    {
      name: "Forest Dwellers Market",
      location: "Gumla",
      artist: "Forest Communities",
      price: "₹1000",
      category: "wood-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Sustainable crafts made by forest-dwelling communities using natural materials.",
      artisan: "Forest Craft Collective",
      delivery: "7-10 days"
    },
    {
      name: "Oraon Tribal Crafts",
      location: "Gumla",
      artist: "Oraon Artisans",
      price: "₹1350",
      category: "Oraon Tribal",
      rating: 4.5,
      image: dokraElephant,
      description: "Authentic Oraon tribal handicrafts showcasing unique cultural traditions and artistry.",
      artisan: "Oraon Master Artists",
      delivery: "5-8 days"
    },
    {
      name: "Gumla Handicraft Emporium",
      location: "Gumla",
      artist: "Government Emporium",
      price: "₹1600",
      category: "Government Store",
      rating: 4.6,
      image: dokraElephant,
      description: "Government-certified premium handicrafts from the official Gumla district emporium.",
      artisan: "Government Certified Artists",
      delivery: "2-4 days"
    },
    // HAZARIBAGH DISTRICT MARKETPLACES
    {
      name: "Hazaribagh National Park Crafts",
      location: "Hazaribagh",
      artist: "Park Community Artists",
      price: "₹1300",
      category: "Wildlife Crafts",
      rating: 4.4,
      image: dokraElephant,
      description: "Wildlife-themed handicrafts inspired by Hazaribagh National Park's rich biodiversity.",
      artisan: "Wildlife Conservation Artists",
      delivery: "4-6 days"
    },
    {
      name: "Canary Hill Market",
      location: "Hazaribagh",
      artist: "Hill Station Vendors",
      price: "₹1100",
      category: "Hill Station",
      rating: 4.2,
      image: dokraElephant,
      description: "Hill station souvenirs and crafts from the scenic Canary Hill area of Hazaribagh.",
      artisan: "Hill Station Collective",
      delivery: "5-7 days"
    },
    {
      name: "Hazaribagh Main Market",
      location: "Hazaribagh",
      artist: "Main Market Vendors",
      price: "₹900",
      category: "Central Market",
      rating: 4.0,
      image: dokraElephant,
      description: "Central market handicrafts from the bustling commercial heart of Hazaribagh.",
      artisan: "Market Traders Association",
      delivery: "3-5 days"
    },
    {
      name: "Coal Mining Heritage Crafts",
      location: "Hazaribagh",
      artist: "Mining Heritage Artists",
      price: "₹1200",
      category: "Mining Heritage",
      rating: 4.1,
      image: dokraElephant,
      description: "Unique crafts celebrating the coal mining heritage and industrial history of the region.",
      artisan: "Heritage Mining Artists",
      delivery: "6-8 days"
    },
    {
      name: "Tribal Art Centre",
      location: "Hazaribagh",
      artist: "Tribal Art Centre",
      price: "₹1500",
      category: "Tribal Art Centre",
      rating: 4.5,
      image: dokraElephant,
      description: "Professional tribal art from the established art centre showcasing authentic techniques.",
      artisan: "Centre Master Artists",
      delivery: "2-4 days"
    },
    // JAMTARA DISTRICT MARKETPLACES
    {
      name: "Jamtara Local Bazaar",
      location: "Jamtara",
      artist: "Local Bazaar Vendors",
      price: "₹700",
      category: "Local Bazaar",
      rating: 3.8,
      image: dokraElephant,
      description: "Local bazaar handicrafts and traditional items from Jamtara's community markets.",
      artisan: "Community Vendors",
      delivery: "6-8 days"
    },
    {
      name: "Rural Artisan Collective",
      location: "Jamtara",
      artist: "Rural Collective",
      price: "₹850",
      category: "Rural Collective",
      rating: 4.0,
      image: dokraElephant,
      description: "Rural artisan collective products supporting local communities and traditional skills.",
      artisan: "Rural Development Group",
      delivery: "7-10 days"
    },
    {
      name: "Jamtara Handicraft Society",
      location: "Jamtara",
      artist: "Handicraft Society",
      price: "₹1000",
      category: "Society Crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Society-organized handicrafts promoting local artisan welfare and skill development.",
      artisan: "Handicraft Society Members",
      delivery: "5-7 days"
    },
    // KHUNTI DISTRICT MARKETPLACES
    {
      name: "Birsa Munda Memorial Crafts",
      location: "Khunti",
      artist: "Memorial Craft Guild",
      price: "₹1400",
      category: "Memorial Crafts",
      rating: 4.5,
      image: dokraElephant,
      description: "Special handicrafts commemorating tribal leader Birsa Munda and tribal freedom movement.",
      artisan: "Memorial Guild Masters",
      delivery: "3-5 days"
    },
    {
      name: "Munda Tribal Heritage Centre",
      location: "Khunti",
      artist: "Heritage Centre",
      price: "₹1600",
      category: "Heritage Centre",
      rating: 4.6,
      image: dokraElephant,
      description: "Premium tribal heritage crafts from the Munda cultural heritage centre.",
      artisan: "Heritage Certified Masters",
      delivery: "2-4 days"
    },
    {
      name: "Traditional Dokra Workshop",
      location: "Khunti",
      artist: "Dokra Master Craftsmen",
      price: "₹2000",
      category: "Dokra Metalwork",
      rating: 4.7,
      image: dokraElephant,
      description: "Authentic Dokra metal casting crafts from traditional workshops in tribal heartland.",
      artisan: "Dokra Master Artisans",
      delivery: "5-8 days"
    },
    {
      name: "Khunti Tribal Market",
      location: "Khunti",
      artist: "Tribal Market Collective",
      price: "₹1200",
      category: "Tribal Market",
      rating: 4.3,
      image: dokraElephant,
      description: "Diverse tribal market crafts representing various communities in Khunti district.",
      artisan: "Multi-Tribal Collective",
      delivery: "4-6 days"
    },
    {
      name: "Forest Produce Market",
      location: "Khunti",
      artist: "Forest Communities",
      price: "₹900",
      category: "Forest Products",
      rating: 4.1,
      image: dokraElephant,
      description: "Sustainable forest produce and crafts supporting forest conservation and community welfare.",
      artisan: "Forest Conservation Group",
      delivery: "8-12 days"
    },
    // KODERMA DISTRICT MARKETPLACES
    {
      name: "Koderma Mica Crafts",
      location: "Koderma",
      artist: "Mica Industry Artists",
      price: "₹1300",
      category: "Mica Industry",
      rating: 4.2,
      image: dokraElephant,
      description: "Unique handicrafts incorporating mica elements, celebrating Koderma's famous mica industry.",
      artisan: "Mica Craft Specialists",
      delivery: "4-6 days"
    },
    {
      name: "Highway Crafts Centre",
      location: "Koderma",
      artist: "Highway Vendors",
      price: "₹800",
      category: "Highway Crafts",
      rating: 3.9,
      image: dokraElephant,
      description: "Convenient highway crafts and souvenirs for travelers on major transportation routes.",
      artisan: "Highway Vendor Association",
      delivery: "2-4 days"
    },
    {
      name: "Koderma Local Market",
      location: "Koderma",
      artist: "Local Market Vendors",
      price: "₹950",
      category: "Local Market",
      rating: 4.0,
      image: dokraElephant,
      description: "Local market handicrafts featuring regional specialties and community-made products.",
      artisan: "Local Vendor Collective",
      delivery: "5-7 days"
    },
    {
      name: "Industrial Heritage Crafts",
      location: "Koderma",
      artist: "Industrial Artists",
      price: "₹1100",
      category: "Industrial Heritage",
      rating: 4.1,
      image: dokraElephant,
      description: "Creative crafts celebrating the industrial heritage and mineral wealth of Koderma region.",
      artisan: "Industrial Heritage Guild",
      delivery: "6-8 days"
    },
    // LATEHAR DISTRICT MARKETPLACES
    {
      name: "Netarhat Hill Station Crafts",
      location: "Latehar",
      artist: "Hill Station Artists",
      price: "₹1200",
      category: "Hill Station",
      rating: 4.3,
      image: dokraElephant,
      description: "Hill station handicrafts and souvenirs from the scenic Netarhat area of Latehar.",
      artisan: "Hill Station Craft Guild",
      delivery: "5-7 days"
    },
    {
      name: "Sunrise Point Souvenirs",
      location: "Latehar",
      artist: "Tourism Vendors",
      price: "₹900",
      category: "Tourism Souvenirs",
      rating: 4.1,
      image: dokraElephant,
      description: "Tourism souvenirs from famous sunrise viewing points and scenic locations.",
      artisan: "Tourism Vendor Association",
      delivery: "6-8 days"
    },
    {
      name: "Latehar Forest Crafts",
      location: "Latehar",
      artist: "Forest Artisans",
      price: "₹1000",
      category: "wood-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Eco-friendly forest crafts made by communities living in Latehar's forested areas.",
      artisan: "Forest Craft Cooperative",
      delivery: "7-10 days"
    },
    {
      name: "Tribal Heritage Workshop",
      location: "Latehar",
      artist: "Heritage Workshop",
      price: "₹1400",
      category: "Heritage Workshop",
      rating: 4.4,
      image: dokraElephant,
      description: "Professional tribal heritage crafts from established workshop promoting cultural preservation.",
      artisan: "Heritage Workshop Masters",
      delivery: "3-5 days"
    },
    // LOHARDAGA DISTRICT MARKETPLACES
    {
      name: "Lohardaga Tribal Market",
      location: "Lohardaga",
      artist: "Tribal Market Collective",
      price: "₹1300",
      category: "Tribal Market",
      rating: 4.3,
      image: dokraElephant,
      description: "Comprehensive tribal market featuring diverse handicrafts from various tribal communities.",
      artisan: "Inter-Tribal Collective",
      delivery: "5-8 days"
    },
    {
      name: "Koel River Crafts",
      location: "Lohardaga",
      artist: "Riverside Artisans",
      price: "₹1100",
      category: "Riverside Crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Riverside crafts inspired by the Koel river ecosystem and aquatic themes.",
      artisan: "Riverside Community Artists",
      delivery: "6-8 days"
    },
    {
      name: "Traditional Craft Centre",
      location: "Lohardaga",
      artist: "Craft Centre Masters",
      price: "₹1500",
      category: "Craft Centre",
      rating: 4.5,
      image: dokraElephant,
      description: "Professional traditional crafts from established centre promoting artisan excellence.",
      artisan: "Centre Certified Masters",
      delivery: "2-4 days"
    },
    {
      name: "Forest Community Crafts",
      location: "Lohardaga",
      artist: "Forest Communities",
      price: "₹950",
      category: "Forest Community",
      rating: 4.1,
      image: dokraElephant,
      description: "Community-based forest crafts supporting sustainable livelihoods and conservation.",
      artisan: "Forest Community Collective",
      delivery: "8-12 days"
    },
    // SAHEBGANJ DISTRICT MARKETPLACES
    {
      name: "Ganges Riverbank Market",
      location: "Sahebganj",
      artist: "Riverbank Artisans",
      price: "₹1200",
      category: "Riverbank Crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Unique riverbank handicrafts inspired by life along the sacred Ganges river.",
      artisan: "Ganges Artisan Collective",
      delivery: "4-6 days"
    },
    {
      name: "Rajmahal Palace Crafts",
      location: "Sahebganj",
      artist: "Palace Heritage Guild",
      price: "₹1800",
      category: "Palace Heritage",
      rating: 4.6,
      image: dokraElephant,
      description: "Royal heritage crafts inspired by the historic Rajmahal Palace and Mughal architecture.",
      artisan: "Palace Heritage Masters",
      delivery: "2-4 days"
    },
    {
      name: "Mango Belt Crafts",
      location: "Sahebganj",
      artist: "Orchard Communities",
      price: "₹1000",
      category: "Orchard Crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Seasonal crafts from mango orchard communities celebrating the famous mango belt region.",
      artisan: "Orchard Artisan Collective",
      delivery: "6-8 days"
    },
    {
      name: "Sahebganj Handicraft Emporium",
      location: "Sahebganj",
      artist: "District Emporium",
      price: "₹1500",
      category: "District Emporium",
      rating: 4.4,
      image: dokraElephant,
      description: "Official district emporium featuring certified handicrafts from across Sahebganj region.",
      artisan: "District Certified Artists",
      delivery: "3-5 days"
    },
    {
      name: "River Transport Heritage Crafts",
      location: "Sahebganj",
      artist: "River Heritage Artists",
      price: "₹1100",
      category: "River Heritage",
      rating: 4.2,
      image: dokraElephant,
      description: "Heritage crafts celebrating the rich river transport tradition and maritime culture.",
      artisan: "Maritime Heritage Guild",
      delivery: "5-7 days"
    },
    // SERAIKELA-KHARSAWAN DISTRICT MARKETPLACES
    {
      name: "Seraikela Palace Market",
      location: "Seraikela",
      artist: "Palace Market Guild",
      price: "₹1600",
      category: "Palace Market",
      rating: 4.5,
      image: dokraElephant,
      description: "Royal palace market crafts featuring traditional designs inspired by Seraikela's royal heritage.",
      artisan: "Palace Artisan Guild",
      delivery: "3-5 days"
    },
    {
      name: "Chhau Dance Craft Centre",
      location: "Seraikela",
      artist: "Chhau Artists",
      price: "₹2000",
      category: "Dance Art",
      rating: 4.7,
      image: dokraElephant,
      description: "Exclusive Chhau dance-themed crafts including masks, costumes, and performance accessories.",
      artisan: "Chhau Master Craftsmen",
      delivery: "5-8 days"
    },
    {
      name: "Kharsawan Forest Market",
      location: "Kharsawan",
      artist: "Forest Market Vendors",
      price: "₹1000",
      category: "Forest Market",
      rating: 4.1,
      image: dokraElephant,
      description: "Forest-based handicrafts and natural products from Kharsawan's forested regions.",
      artisan: "Forest Vendor Collective",
      delivery: "7-10 days"
    },
    {
      name: "Royal Heritage Emporium",
      location: "Seraikela",
      artist: "Royal Heritage Board",
      price: "₹2200",
      category: "Royal Heritage",
      rating: 4.8,
      image: dokraElephant,
      description: "Premium royal heritage crafts from the official heritage board promoting cultural preservation.",
      artisan: "Royal Heritage Masters",
      delivery: "2-4 days"
    },
    {
      name: "Cultural Performance Crafts",
      location: "Seraikela",
      artist: "Performance Artists",
      price: "₹1400",
      category: "Performance Art",
      rating: 4.4,
      image: dokraElephant,
      description: "Crafts related to traditional performances, festivals, and cultural celebrations.",
      artisan: "Cultural Performance Guild",
      delivery: "4-6 days"
    },
    // SIMDEGA DISTRICT MARKETPLACES
    {
      name: "Simdega Tribal Heritage Market",
      location: "Simdega",
      artist: "Tribal Heritage Collective",
      price: "₹1500",
      category: "Tribal Heritage",
      rating: 4.4,
      image: dokraElephant,
      description: "Comprehensive tribal heritage market showcasing authentic crafts from Simdega's tribal communities.",
      artisan: "Heritage Tribal Masters",
      delivery: "4-6 days"
    },
    {
      name: "Hill Tribal Crafts",
      location: "Simdega",
      artist: "Hill Tribal Artists",
      price: "₹1300",
      category: "Hill Tribal",
      rating: 4.3,
      image: dokraElephant,
      description: "Hill tribal handicrafts from elevated regions showcasing mountain tribal artistry.",
      artisan: "Hill Tribal Collective",
      delivery: "5-8 days"
    },
    {
      name: "Eco-Tribal Market",
      location: "Simdega",
      artist: "Eco-Tribal Group",
      price: "₹1200",
      category: "Eco-Tribal",
      rating: 4.2,
      image: dokraElephant,
      description: "Environmentally conscious tribal crafts promoting sustainability and conservation.",
      artisan: "Eco-Conservation Artists",
      delivery: "6-9 days"
    },
    {
      name: "Simdega Handicraft Centre",
      location: "Simdega",
      artist: "District Craft Centre",
      price: "₹1700",
      category: "District Centre",
      rating: 4.5,
      image: dokraElephant,
      description: "Professional handicraft centre featuring certified artisans and quality traditional crafts.",
      artisan: "Centre Professional Artists",
      delivery: "2-4 days"
    },
    // WEST SINGHBHUM DISTRICT MARKETPLACES
    {
      name: "Chaibasa Central Market",
      location: "Chaibasa",
      artist: "Central Market Guild",
      price: "₹1400",
      category: "Central Market",
      rating: 4.3,
      image: dokraElephant,
      description: "Central market handicrafts from Chaibasa representing diverse tribal and regional artistry.",
      artisan: "Market Guild Masters",
      delivery: "3-5 days"
    },
    {
      name: "Saranda Forest Crafts",
      location: "West Singhbhum",
      artist: "Saranda Forest Artists",
      price: "₹1600",
      category: "Forest Premium",
      rating: 4.6,
      image: dokraElephant,
      description: "Premium forest crafts from the famous Saranda forests, supporting conservation efforts.",
      artisan: "Saranda Conservation Artists",
      delivery: "5-8 days"
    },
    {
      name: "Munda Heritage Centre",
      location: "West Singhbhum",
      artist: "Munda Heritage Board",
      price: "₹2000",
      category: "Munda Heritage",
      rating: 4.7,
      image: dokraElephant,
      description: "Authentic Munda tribal heritage crafts from official heritage centre and cultural board.",
      artisan: "Munda Heritage Masters",
      delivery: "3-5 days"
    },
    {
      name: "Iron Ore Mining Crafts",
      location: "West Singhbhum",
      artist: "Mining Heritage Artists",
      price: "₹1200",
      category: "Mining Heritage",
      rating: 4.1,
      image: dokraElephant,
      description: "Unique crafts celebrating the iron ore mining heritage and industrial history of the region.",
      artisan: "Mining Heritage Collective",
      delivery: "6-8 days"
    },
    {
      name: "Tribal Forest Market",
      location: "West Singhbhum",
      artist: "Tribal Forest Communities",
      price: "₹1100",
      category: "Tribal Forest",
      rating: 4.2,
      image: dokraElephant,
      description: "Tribal forest community crafts promoting sustainable forest livelihoods and cultural preservation.",
      artisan: "Forest Tribal Collective",
      delivery: "7-10 days"
    },
    {
      name: "West Singhbhum Emporium",
      location: "West Singhbhum",
      artist: "District Government",
      price: "₹1800",
      category: "Government Emporium",
      rating: 4.5,
      image: dokraElephant,
      description: "Official government emporium showcasing the finest handicrafts from across West Singhbhum district.",
      artisan: "Government Certified Masters",
      delivery: "2-4 days"
    },
    // ADDITIONAL MARKETPLACE ENTRIES TO COMPLETE TARGET
    {
      name: "Jharkhand State Emporium",
      location: "Ranchi",
      artist: "State Government",
      price: "₹2500",
      category: "State Emporium",
      rating: 4.8,
      image: dokraElephant,
      description: "Premium state emporium showcasing the finest handicrafts from across all districts of Jharkhand.",
      artisan: "State Certified Master Artists",
      delivery: "1-3 days"
    },
    {
      name: "Tribal Art Gallery",
      location: "Ranchi",
      artist: "Gallery Curators",
      price: "₹3000",
      category: "Art Gallery",
      rating: 4.9,
      image: dokraElephant,
      description: "Curated tribal art gallery featuring museum-quality pieces and contemporary tribal art.",
      artisan: "Gallery Certified Artists",
      delivery: "2-4 days"
    },
    {
      name: "Master Craftsmen Collective",
      location: "Dumka",
      artist: "Master Craftsmen Guild",
      price: "₹2200",
      category: "Master Crafts",
      rating: 4.7,
      image: dokraElephant,
      description: "Exclusive collection from master craftsmen representing the pinnacle of tribal artistry.",
      artisan: "Guild Master Craftsmen",
      delivery: "3-5 days"
    },
    {
      name: "Heritage Preservation Centre",
      location: "Khunti",
      artist: "Heritage Preservationists",
      price: "₹2800",
      category: "Heritage Preservation",
      rating: 4.8,
      image: dokraElephant,
      description: "Heritage preservation centre crafts maintaining traditional techniques and cultural authenticity.",
      artisan: "Heritage Preservation Experts",
      delivery: "2-4 days"
    },
    {
      name: "Eco-Artisan Cooperative",
      location: "Palamu",
      artist: "Eco-Artisan Guild",
      price: "₹1800",
      category: "Eco-Artisan",
      rating: 4.5,
      image: dokraElephant,
      description: "Environmentally conscious artisan cooperative promoting sustainable crafts and practices.",
      artisan: "Eco-Certified Artisans",
      delivery: "4-6 days"
    },
    {
      name: "Women Empowerment Crafts",
      location: "Deoghar",
      artist: "Women's Federation",
      price: "₹1500",
      category: "Women Empowerment",
      rating: 4.6,
      image: dokraElephant,
      description: "Empowering women through craft creation and economic independence initiatives.",
      artisan: "Women Artisan Federation",
      delivery: "3-5 days"
    },
    {
      name: "Youth Artisan Initiative",
      location: "Jamshedpur",
      artist: "Youth Artists",
      price: "₹1200",
      category: "Youth Initiative",
      rating: 4.3,
      image: dokraElephant,
      description: "Young artisans creating innovative designs while preserving traditional techniques.",
      artisan: "Youth Artisan Collective",
      delivery: "4-6 days"
    },
    {
      name: "International Craft Exchange",
      location: "Ranchi",
      artist: "International Exchange",
      price: "₹3500",
      category: "International",
      rating: 4.9,
      image: dokraElephant,
      description: "International quality tribal crafts meeting global standards and export requirements.",
      artisan: "International Certified Artists",
      delivery: "1-2 days"
    },
    {
      name: "Cultural Tourism Crafts",
      location: "Sahebganj",
      artist: "Tourism Board",
      price: "₹1600",
      category: "Tourism",
      rating: 4.4,
      image: dokraElephant,
      description: "Official tourism board crafts representing Jharkhand's cultural diversity to visitors.",
      artisan: "Tourism Certified Vendors",
      delivery: "2-4 days"
    },
    {
      name: "Innovation in Tradition",
      location: "Dhanbad",
      artist: "Innovation Artists",
      price: "₹2000",
      category: "Innovation",
      rating: 4.6,
      image: dokraElephant,
      description: "Innovative approaches to traditional crafts creating contemporary appeal while maintaining authenticity.",
      artisan: "Innovation Lab Artists",
      delivery: "3-5 days"
    },
    // KHUNTI DISTRICT MARKETPLACES
    {
      name: "Khunti Bazar Crafts",
      location: "Khunti",
      artist: "Khunti Bazar Vendors",
      price: "₹900",
      category: "tribal-art",
      rating: 4.2,
      image: dokraElephant,
      description: "Traditional tribal handicrafts from Khunti Bazar featuring authentic Munda artistry.",
      artisan: "Tribal Craftsmen",
      delivery: "5-7 days"
    },
    {
      name: "Khunti Haat Products",
      location: "Khunti",
      artist: "Haat Vendors",
      price: "₹750",
      category: "rural-crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Weekly haat market products from Khunti showcasing rural craftsmanship.",
      artisan: "Haat Artisans",
      delivery: "6-8 days"
    },
    {
      name: "Hutar Bazar Specialties",
      location: "Khunti",
      artist: "Hutar Bazar Guild",
      price: "₹1100",
      category: "forest-products",
      rating: 4.3,
      image: dokraElephant,
      description: "Forest-based handicrafts from Hutar Bazar supporting local communities.",
      artisan: "Forest Artisans",
      delivery: "4-6 days"
    },
    {
      name: "Jaltanda Bazar Items",
      location: "Khunti",
      artist: "Jaltanda Traders",
      price: "₹850",
      category: "local-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Local handicrafts from Jaltanda Bazar representing Khunti's cultural heritage.",
      artisan: "Local Guild",
      delivery: "5-7 days"
    },
    {
      name: "Karra Market Collections",
      location: "Khunti",
      artist: "Karra More Artisans",
      price: "₹1200",
      category: "community-crafts",
      rating: 4.4,
      image: dokraElephant,
      description: "Community handicrafts from Karra Market/Karra More Torpa area.",
      artisan: "Community Collective",
      delivery: "3-5 days"
    },
    // KODERMA DISTRICT MARKETPLACES
    {
      name: "Domchanch Bazar Hat",
      location: "Koderma",
      artist: "Domchanch Vendors",
      price: "₹950",
      category: "rural-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Rural handicrafts from Domchanch Bazar Hat featuring traditional techniques.",
      artisan: "Rural Craftsmen",
      delivery: "5-8 days"
    },
    {
      name: "Markacho Market Products",
      location: "Koderma",
      artist: "Markacho Artisans",
      price: "₹800",
      category: "local-specialties",
      rating: 4.0,
      image: dokraElephant,
      description: "Local specialty handicrafts from Markacho Market area in Koderma.",
      artisan: "Market Specialists",
      delivery: "6-9 days"
    },
    {
      name: "Dardahi Chowk Crafts",
      location: "Koderma",
      artist: "Dardahi Chowk Guild",
      price: "₹1050",
      category: "chowk-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Chowk marketplace handicrafts from Dardahi Chowk commercial area.",
      artisan: "Chowk Collective",
      delivery: "4-6 days"
    },
    {
      name: "Hirodih Market Items",
      location: "Koderma",
      artist: "Hirodih Vendors",
      price: "₹1150",
      category: "mixed-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Mixed handicrafts from Hirodih Market/Karma Chowk/Katiya Market area.",
      artisan: "Market Association",
      delivery: "5-7 days"
    },
    {
      name: "Jhumri Telaiya Bazar",
      location: "Koderma",
      artist: "Telaiya Traders",
      price: "₹900",
      category: "bypass-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Handicrafts from Jhumri Telaiya Bazar and By-pass Road markets.",
      artisan: "Highway Vendors",
      delivery: "4-7 days"
    },
    // LATEHAR DISTRICT MARKETPLACES
    {
      name: "Netarhat Market Crafts",
      location: "Latehar",
      artist: "Netarhat Artisans",
      price: "₹1300",
      category: "hill-station-crafts",
      rating: 4.5,
      image: dokraElephant,
      description: "Hill station handicrafts from Netarhat Market tourist spot.",
      artisan: "Hill Artisans",
      delivery: "3-5 days"
    },
    {
      name: "Pokhari Bazaar Products",
      location: "Latehar",
      artist: "Pokhari Vendors",
      price: "₹850",
      category: "bazaar-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Traditional bazaar handicrafts from Pokhari Bazaar marketplace.",
      artisan: "Bazaar Guild",
      delivery: "5-7 days"
    },
    {
      name: "Jatra Tand Thursday Market",
      location: "Latehar",
      artist: "Thursday Market Vendors",
      price: "₹750",
      category: "weekly-market",
      rating: 4.0,
      image: dokraElephant,
      description: "Weekly market handicrafts from Jatra Tand Thursday market.",
      artisan: "Weekly Vendors",
      delivery: "7-10 days"
    },
    {
      name: "Islamiya Market Collections",
      location: "Latehar",
      artist: "Islamiya Traders",
      price: "₹1000",
      category: "community-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Community handicrafts from Islamiya Market in Latehar district.",
      artisan: "Community Artisans",
      delivery: "4-6 days"
    },
    {
      name: "Seregara Bajar Haat",
      location: "Latehar",
      artist: "Seregara Vendors",
      price: "₹650",
      category: "local-haat",
      rating: 3.9,
      image: dokraElephant,
      description: "Local haat handicrafts from Seregara Bajar traditional market.",
      artisan: "Haat Craftsmen",
      delivery: "6-9 days"
    },
    // LOHARDAGA DISTRICT MARKETPLACES
    {
      name: "Maina Bagicha Bazaar",
      location: "Lohardaga",
      artist: "Maina Bagicha Vendors",
      price: "₹950",
      category: "garden-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Garden-themed handicrafts from Maina Bagicha Bazaar marketplace.",
      artisan: "Garden Artisans",
      delivery: "5-7 days"
    },
    {
      name: "MM Market Products",
      location: "Lohardaga",
      artist: "MM Market Guild",
      price: "₹1100",
      category: "commercial-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Commercial handicrafts from MM Market in Lohardaga district.",
      artisan: "Commercial Guild",
      delivery: "3-5 days"
    },
    {
      name: "Kuru Bazaar Specialties",
      location: "Lohardaga",
      artist: "Kuru Bazaar Artisans",
      price: "₹800",
      category: "rural-specialties",
      rating: 4.1,
      image: dokraElephant,
      description: "Rural specialty handicrafts from Kuru Bazaar traditional market.",
      artisan: "Rural Specialists",
      delivery: "6-8 days"
    },
    {
      name: "Barki Chanpi Market",
      location: "Lohardaga",
      artist: "Multiple Market Vendors",
      price: "₹1200",
      category: "multi-market",
      rating: 4.4,
      image: dokraElephant,
      description: "Handicrafts from Barki Chanpi Market/Hisri Bazaar/Ali Market/Daily Market collective.",
      artisan: "Multi-Market Guild",
      delivery: "4-6 days"
    },
    // SAHIBGANJ DISTRICT MARKETPLACES
    {
      name: "Main Market Srikund Bazar",
      location: "Sahibganj",
      artist: "Srikund Vendors",
      price: "₹1050",
      category: "river-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "River-themed handicrafts from Main Market Srikund Bazar, Barharwa.",
      artisan: "River Artisans",
      delivery: "4-6 days"
    },
    {
      name: "Srikund Haat Products",
      location: "Sahibganj",
      artist: "Srikund Haat Vendors",
      price: "₹750",
      category: "haat-crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Traditional haat handicrafts from Srikund Haat marketplace.",
      artisan: "Haat Collective",
      delivery: "6-8 days"
    },
    {
      name: "Pranpur Naya Bazaar",
      location: "Sahibganj",
      artist: "Rajmahal Artisans",
      price: "₹900",
      category: "historical-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Historical handicrafts from Pranpur Naya Bazaar, Rajmahal area.",
      artisan: "Historical Guild",
      delivery: "5-7 days"
    },
    {
      name: "Abdullah Market Collections",
      location: "Sahibganj",
      artist: "Lalbathani Vendors",
      price: "₹850",
      category: "community-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Community handicrafts from Abdullah Market, Lalbathani area.",
      artisan: "Community Artisans",
      delivery: "5-8 days"
    },
    {
      name: "Fullwariya Market Items",
      location: "Sahibganj",
      artist: "Rajmahal Craftsmen",
      price: "₹1150",
      category: "regional-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Regional handicrafts from Fullwariya Market, Rajmahal region.",
      artisan: "Regional Guild",
      delivery: "4-6 days"
    },
    // SERAIKELA-KHARSAWAN DISTRICT MARKETPLACES
    {
      name: "Seraikela City Centre",
      location: "Seraikela-Kharsawan",
      artist: "City Centre Vendors",
      price: "₹1200",
      category: "urban-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Urban handicrafts from Seraikela town City Centre marketplace.",
      artisan: "Urban Guild",
      delivery: "3-5 days"
    },
    {
      name: "Chandil Market Products",
      location: "Seraikela-Kharsawan",
      artist: "Chandil Artisans",
      price: "₹950",
      category: "local-crafts",
      rating: 4.1,
      image: dokraElephant,
      description: "Local handicrafts from Chandil and surrounding market areas.",
      artisan: "Local Craftsmen",
      delivery: "4-6 days"
    },
    // SIMDEGA DISTRICT MARKETPLACES
    {
      name: "Main Road Bazaar Agrasen",
      location: "Simdega",
      artist: "Agrasen Chowk Vendors",
      price: "₹1100",
      category: "central-crafts",
      rating: 4.4,
      image: dokraElephant,
      description: "Central market handicrafts from Main Road Bazaar near Agrasen Chowk.",
      artisan: "Central Guild",
      delivery: "3-5 days"
    },
    {
      name: "Prince Chowk Collections",
      location: "Simdega",
      artist: "Prince Chowk Artisans",
      price: "₹850",
      category: "chowk-crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Chowk handicrafts from Prince Chowk, Niche Bazaar, Indira Chowk area.",
      artisan: "Chowk Collective",
      delivery: "5-7 days"
    },
    {
      name: "Jhulan Singh Chowk Market",
      location: "Simdega",
      artist: "Jhulan Singh Vendors",
      price: "₹750",
      category: "local-market",
      rating: 3.9,
      image: dokraElephant,
      description: "Local market handicrafts from Jhulan Singh Chowk area.",
      artisan: "Local Vendors",
      delivery: "6-8 days"
    },
    {
      name: "Kolebira Market Crafts",
      location: "Simdega",
      artist: "Kolebira Artisans",
      price: "₹1000",
      category: "tribal-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Tribal handicrafts from Kolebira Market showcasing local tribal artistry.",
      artisan: "Tribal Guild",
      delivery: "4-6 days"
    },
    {
      name: "Multiple Simdega Markets",
      location: "Simdega",
      artist: "Multi-Market Collective",
      price: "₹1300",
      category: "diverse-crafts",
      rating: 4.5,
      image: dokraElephant,
      description: "Diverse handicrafts from Salgaposh Market, Bazar Tand, Piriaponch Market, Jampani Local Market, and others.",
      artisan: "Multi-Market Guild",
      delivery: "3-5 days"
    },
    // WEST SINGHBHUM DISTRICT MARKETPLACES
    {
      name: "Jain Market Chaibasa",
      location: "West Singhbhum",
      artist: "Jain Market Vendors",
      price: "₹1150",
      category: "commercial-crafts",
      rating: 4.3,
      image: dokraElephant,
      description: "Commercial handicrafts from Jain Market (Opposite Pillai Hall) in Chaibasa.",
      artisan: "Commercial Guild",
      delivery: "4-6 days"
    },
    {
      name: "Vishwakarma Market Crafts",
      location: "West Singhbhum",
      artist: "Sadar Bazaar Artisans",
      price: "₹950",
      category: "traditional-crafts",
      rating: 4.2,
      image: dokraElephant,
      description: "Traditional handicrafts from Vishwakarma Market, Sadar Bazaar Chaibasa.",
      artisan: "Traditional Guild",
      delivery: "5-7 days"
    },
    {
      name: "Nimdia Gudaam Products",
      location: "West Singhbhum",
      artist: "Nimdia Vendors",
      price: "₹800",
      category: "warehouse-crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Warehouse-stored handicrafts from Nimdia Gudaam marketplace.",
      artisan: "Warehouse Guild",
      delivery: "6-8 days"
    },
    {
      name: "Shaniwar Haat Collections",
      location: "West Singhbhum",
      artist: "Weekly Market Collective",
      price: "₹900",
      category: "weekly-haat",
      rating: 4.1,
      image: dokraElephant,
      description: "Weekly haat handicrafts from Shaniwar Haat, Haatsai, CKP Bazaar, Sarjamhatu Market.",
      artisan: "Haat Collective",
      delivery: "5-8 days"
    },
    // BOKARO DISTRICT MARKETPLACES
    {
      name: "City Centre Sector 4",
      location: "Bokaro",
      artist: "City Centre Vendors",
      price: "₹1400",
      category: "urban-crafts",
      rating: 4.5,
      image: dokraElephant,
      description: "Premium urban handicrafts from City Centre, Sector 4 - main business district.",
      artisan: "Urban Premium Guild",
      delivery: "2-4 days"
    },
    {
      name: "Harsh Vardhan Plaza",
      location: "Bokaro",
      artist: "Plaza Artisans",
      price: "₹1600",
      category: "plaza-crafts",
      rating: 4.6,
      image: dokraElephant,
      description: "Premium plaza handicrafts from Harsh Vardhan Plaza at City Centre.",
      artisan: "Plaza Premium Guild",
      delivery: "2-3 days"
    },
    // CHATRA DISTRICT MARKETPLACES
    {
      name: "Chatra Local Bazaar",
      location: "Chatra",
      artist: "Chatra Local Vendors",
      price: "₹750",
      category: "local-crafts",
      rating: 4.0,
      image: dokraElephant,
      description: "Local handicrafts from Chatra district's traditional bazaars and weekly markets.",
      artisan: "Local Artisans",
      delivery: "6-8 days"
    },
    {
      name: "Chatra Rural Markets",
      location: "Chatra",
      artist: "Rural Market Collective",
      price: "₹650",
      category: "rural-crafts",
      rating: 3.9,
      image: dokraElephant,
      description: "Rural handicrafts from various local markets and villages in Chatra district.",
      artisan: "Rural Collective",
      delivery: "7-10 days"
    }
  ];

  // Helper function to categorize handicrafts
  const getCategoryGroup = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('metal') || categoryLower.includes('dokra')) return 'metal-art';
    if (categoryLower.includes('textile') || categoryLower.includes('fabric')) return 'textiles';
    if (categoryLower.includes('folk') || categoryLower.includes('painting')) return 'folk-art';
    if (categoryLower.includes('basketry') || categoryLower.includes('bamboo')) return 'basketry';
    if (categoryLower.includes('tribal')) return 'tribal-art';
    if (categoryLower.includes('wood') || categoryLower.includes('forest')) return 'wood-crafts';
    if (categoryLower.includes('religious') || categoryLower.includes('temple')) return 'religious-crafts';
    if (categoryLower.includes('heritage') || categoryLower.includes('palace') || categoryLower.includes('museum')) return 'heritage-crafts';
    return 'tribal-art'; // Default to tribal-art for others
  };

  // Calculate dynamic category counts
  const craftCategories = [
    { id: "all", name: "All Handicrafts", count: handicrafts.length },
    { id: "metal-art", name: "Metal Art & Dokra", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'metal-art').length },
    { id: "textiles", name: "Textiles & Fabrics", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'textiles').length },
    { id: "folk-art", name: "Folk Art", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'folk-art').length },
    { id: "basketry", name: "Basketry & Bamboo", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'basketry').length },
    { id: "tribal-art", name: "Tribal Crafts", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'tribal-art').length },
    { id: "wood-crafts", name: "Wood Crafts", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'wood-crafts').length },
    { id: "religious-crafts", name: "Religious Items", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'religious-crafts').length },
    { id: "heritage-crafts", name: "Heritage Crafts", count: handicrafts.filter(h => getCategoryGroup(h.category) === 'heritage-crafts').length }
  ];

  // Filter handicrafts based on category and search term
  const filteredHandicrafts = handicrafts.filter(item => {
    const itemCategory = getCategoryGroup(item.category);
    const matchesCategory = selectedCategory === "all" || itemCategory === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main>
      <DevelopmentNotice />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Handicrafts Marketplace</h1>
            <p className="text-xl mb-8 max-w-4xl mx-auto">
              Discover authentic handicrafts from local artisans across Jharkhand
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Input 
                type="text"
                placeholder="Search handicrafts, artists, or craft types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/70"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Category Filter Section */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {craftCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {selectedCategory === category.id ? filteredHandicrafts.length : category.count}
                </Badge>
              </Button>
            ))}
          </div>
          
          {/* Results Summary */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {filteredHandicrafts.length} Handicrafts Available
            </h2>
            <p className="text-muted-foreground">
              {selectedCategory !== "all" 
                ? `Showing ${craftCategories.find(c => c.id === selectedCategory)?.name} collection`
                : "Discover authentic handicrafts from local artisans across Jharkhand"
              }
            </p>
          </div>
        </div>
      </section>

      {/* Handicrafts Section */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Authentic Handicrafts</h2>
              <p className="text-muted-foreground mt-2">
                {filteredHandicrafts.length} handcrafted items available
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Sort by Price</Button>
              <Button variant="outline" size="sm">Sort by Rating</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHandicrafts.map((craft, index) => {
              const craftId = generateItemId(craft.name);
              return (
                <Link key={index} to={`/marketplace/${craftId}`} className="block">
                  <Card className="overflow-hidden bg-card border-border hover:shadow-card transition-all duration-300 group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                      src={craft.image}
                      alt={`${craft.name} by ${craft.artist} - Traditional handicraft with ${craft.rating} star rating`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{craft.rating}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Heart className="w-6 h-6 text-white hover:text-red-400 cursor-pointer transition-colors" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {craft.name}
                      </h3>
                      <p className="text-sm text-primary font-medium mb-2">
                        by {craft.artist}
                      </p>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                        {craft.description}
                      </p>

                      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                        <span>{craft.artisan}</span>
                        <span>Delivery: {craft.delivery}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {craft.price}
                        </span>
                        <Button variant="default">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
          </div>
        </section>

        <Footer />
      </main>
    );
  };

  export default Marketplace;

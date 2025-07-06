# Set base paths
$basePath = "entry\src\main\resources\base\media"
$dishesPath = "$basePath\dishes"

# Create directories if not exist
$categories = @("hot", "cold", "soup", "staple", "drink")
foreach ($category in $categories) {
    $path = "$dishesPath\$category"
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Force -Path $path
    }
}

# Move and rename images
# Hot dishes
Move-Item -Force "$basePath\dish_kungpao.png" "$dishesPath\hot\gongbao_chicken.png"
Move-Item -Force "$basePath\dish_fish.png" "$dishesPath\hot\fish_dish.png"
Move-Item -Force "$basePath\dish_pork.png" "$dishesPath\hot\pork_dish.png"

# Staple food
Move-Item -Force "$basePath\dish_bun.png" "$dishesPath\staple\steamed_bun.png"

# Soup
Move-Item -Force "$basePath\dish_soup.png" "$dishesPath\soup\soup_dish.png"

# Seafood (temporarily in hot dishes)
Move-Item -Force "$basePath\dish_scallop.png" "$dishesPath\hot\scallop_dish.png"

# Others
Move-Item -Force "$basePath\dish_duck.png" "$dishesPath\hot\roasted_duck.png"
Move-Item -Force "$basePath\dish_veggie.png" "$dishesPath\cold\mixed_veggies.png"

Write-Host "Images moved successfully!" 
# Set paths
$mediaPath = "entry\src\main\resources\base\media"
$dishesPath = "$mediaPath\dishes"

# Move images back to media directory
# Hot dishes
Move-Item -Force "$dishesPath\hot\gongbao_chicken.png" "$mediaPath\dish_gongbao_chicken.png"
Move-Item -Force "$dishesPath\hot\fish_dish.png" "$mediaPath\dish_fish_hot.png"
Move-Item -Force "$dishesPath\hot\roasted_duck.png" "$mediaPath\dish_roasted_duck.png"
Move-Item -Force "$dishesPath\hot\scallop_dish.png" "$mediaPath\dish_scallop.png"
Move-Item -Force "$dishesPath\hot\pork_dish.png" "$mediaPath\dish_pork.png"

# Cold dishes
Move-Item -Force "$dishesPath\cold\cucumber_salad.png" "$mediaPath\dish_cucumber_salad.png"
Move-Item -Force "$dishesPath\cold\black_fungus.png" "$mediaPath\dish_black_fungus.png"
Move-Item -Force "$dishesPath\cold\white_cut_chicken.png" "$mediaPath\dish_white_cut_chicken.png"
Move-Item -Force "$dishesPath\cold\mixed_veggies.png" "$mediaPath\dish_mixed_veggies.png"

# Staple food
Move-Item -Force "$dishesPath\staple\plain_noodles.png" "$mediaPath\dish_plain_noodles.png"
Move-Item -Force "$dishesPath\staple\yangzhou_rice.png" "$mediaPath\dish_yangzhou_rice.png"
Move-Item -Force "$dishesPath\staple\steamed_bun.png" "$mediaPath\dish_steamed_bun.png"

# Soup
Move-Item -Force "$dishesPath\soup\soup_dish.png" "$mediaPath\dish_soup.png"

# Drinks
Move-Item -Force "$dishesPath\drink\cola.png" "$mediaPath\drink_cola.png"
Move-Item -Force "$dishesPath\drink\sprite.png" "$mediaPath\drink_sprite.png"
Move-Item -Force "$dishesPath\drink\jasmine_tea.png" "$mediaPath\drink_jasmine_tea.png"
Move-Item -Force "$dishesPath\drink\lemon_water.png" "$mediaPath\drink_lemon_water.png"

# Remove dishes directory
Remove-Item -Force -Recurse "$dishesPath"

Write-Host "Images moved back successfully!" 
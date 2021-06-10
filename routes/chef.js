const express = require('express'),
    User = require('../models/user'),
    food_dataset = require('../dataset/food_dataset.json'),
    utils = require('../utils/utils'),
    chef = express.Router();

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// function to calculate some basic macros
// parameters: age, weight, height, gender, goal, bodyfat, activity_level, preset_diet, weight_goal, weight_goal_weekly_value
function calculateMacros(a, b, c, d, e, f, g, h, l, k) {
    var n;
    n = parseInt((10 * (1 / 2.2046) * b + 15.875 * c - 5 * a + ("M" === d ? 5 : "F" === d ? -161 : -78)) * g);
    var m = c = a = 0;
    d = !1;
    !isNaN(k) && 0 > k && (k = Math.abs(k));
    l && (l < b ? isNaN(k) || 0 == k ? e = "L" : k *= -1 : l === b ? (k = 0,
        e = "M") : e = "G");
    null != k && 0 > k || "L" == e ? (a = 1.5 > g ? 0.1 * b : 1.7 > g ? 0.3 * b : 1 * b,
        c = 0.3 * b,
        m = g / 1.7,
        m = 10 == f ? 1 * b * m : 20 == f ? 0.8 * b * m : 30 == f ? 0.6 * b * m : 0.8 * b * m,
        null != k && 0 != k ? (b = n + 3400 * k,
            b /= n,
            0.5 >= b && (d = !0,
                b = 0.5)) : b = 0.8) : null != k && 0 < k || "G" == e ? (a = 1.5 > g ? 0.8 * b : 1.7 > g ? 1.5 * b : 1.8 > g ? 2 * b : 3 * b,
                    c = 0.5 * b,
                    m = 10 == f ? 1.2 * b : 20 == f ? 1 * b : 30 == f ? 0.8 * b : 1 * b,
                    null != k && 0 != k ? (b = n + 3500 * k,
                        b /= n) : b = 1.15) : (a = 1.5 > g ? 0.3 * b : 1.7 > g ? 0.8 * b : 1.8 > g ? 2 * b : 3 * b,
                            c = 0.5 * b,
                            m = g / 1.7,
                            m = 10 == f ? 1.1 * b * m : 20 == f ? 0.9 * b * m : 30 == f ? 0.7 * b * m : 0.9 * b * m,
                            b = 1);
    b = Math.max(Math.ceil(n * b), 200);
    f = 0.5 * b / 4;
    k = 0.5 * b / 9;
    n = 0.5 * b / 4;
    "atkins / ketogenic" == h ? (a = 0,
        f = 40,
        k = 0.8 * b / 9,
        n = 0.3 * b / 4,
        c = (b - 4 * n - 4 * f) / 9) : "paleo" == h ? 150 < a ? (f = a,
            a = 100) : (100 < a && 150 > a && (a = 100),
                f = 150) : "mediterranean" == h ? (a *= 0.9,
                    m *= 0.9) : "zone" == h ? (a = Math.max(0, 0.4 * b / 4 - 5),
                        f = 0.4 * b / 4 + 5,
                        c = Math.max(0, 0.3 * b / 9 - 3),
                        k = 0.3 * b / 9 + 3,
                        m = Math.max(0, 0.3 * b / 4 - 5),
                        n = 0.3 * b / 4 + 5) : "vegetarian" == h ? m *= 0.8 : "vegan" == h && (m *= 0.6);
    "zone" != h && 250 < m && (m = 250);
    g = getCaloriesFromMacros(a, c, m);
    g >= b && (h = 4 * a / g,
        e = 9 * c / g,
        g = 4 * m / g,
        0.2 < h && (a = (h - 0.03) * b / 4),
        0.2 < e && (c = (e - 0.03) * b / 9),
        0.2 < g && (m = (g - 0.03) * b / 4));
    a = Math.floor(a);
    c = Math.floor(c);
    m = Math.floor(m);
    f = Math.ceil(f);
    k = Math.ceil(k);
    n = Math.ceil(n);
    a >= f && (a = 2 >= a ? 0 : roundNumber(0.75 * f, 0));
    c >= k && (c = 2 >= c ? 0 : roundNumber(0.75 * k, 0));
    m >= n && (m = 2 >= m ? 0 : roundNumber(0.75 * n, 0));
    return {
        calories: b,
        min_carbs: a,
        min_fats: c,
        min_proteins: m,
        max_carbs: f,
        max_fats: k,
        max_proteins: n,
        capped_min_calories: d
    }
}

// calculates calories from macros
// parameters: carbs, fats, proteins
function getCaloriesFromMacros(carbs, fats, proteins) {
    return 4 * carbs + 9 * fats + 4 * proteins
}
// 14164

async function createMenu(macros_data) {
    let req_calories = macros_data.calories,
        //     min_carbs = macros_data.min_carbs,
        //     min_fats = macros_data.min_fats,
        //     min_proteins = macros_data.min_proteins,
        //     max_carbs = macros_data.max_carbs,
        //     max_fats = macros_data.max_fats,
        //     max_proteins = macros_data.max_proteins;
        week_menu = [[], [], [], [], [], [], []];


    for (let i = 0; i < 7; i++) {
        let current_callories = 0;
        // current_fats = 0,
        // current_proteins = 0,
        // current_carbs = 0;

        while (current_callories < req_calories * 0.9) {
            let food_item = food_dataset[getRandomNumber(0, 14164)]

            if (current_callories + food_item.Calories * 2 <= req_calories) {
                week_menu[i].push({
                    name: food_item.Name,
                    calories: food_item.Calories,
                    carbs: food_item.Carbos,
                    fats: food_item.Fats,
                    proteins: food_item.Proteins,
                    servings: 2
                });
                current_callories += food_item.Calories * 2;
            }

        }
    }
    return week_menu;

}

chef.post('/createMenu', utils.authenticateToken, async (req, res) => {
    const data = req.body;
    const user = await User.findById(req.cookies.user)

    if (user != null) {

        let macros_data = calculateMacros(data.age, utils.convertKgToLbs(data.weight),
            utils.convertCmToInch(data.height), data.gender, data.goal,
            data.bodyfat, data.activity_level, data.preset_diet, data.weight_goal,
            data.weight_goal_weekly_value);

        let week_menu = await createMenu(macros_data)

        user.menu = {
            monday: week_menu[0],
            tuesday: week_menu[1],
            wednesday: week_menu[2],
            thursday: week_menu[3],
            friday: week_menu[4],
            saturday: week_menu[5],
            sunday: week_menu[6]
        }
        const result = await user.save();

        if (result == null) {
            res.sendStatus(400);
        } else {
            console.log(macros_data)
            res.json(user.menu);
        }

    } else {
        res.sendStatus(400);
    }
});

chef.get('/load', utils.authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.cookies.user)

        if (user == null) {
            res.sendStatus(404);
        } else {
            res.json(user.menu);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = chef;
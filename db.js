import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

await db.migrate();

// All Price Plans
export async function allPlans(){
    const sql = await db.all(`select * from price_plan`);
    return sql;
}

const pricePlans = await allPlans();
console.log(pricePlans);

// Bill Calculation
export async function totalBill(plan_name, actions) {
    const sql = `select * from price_plan where plan_name = ?`;
    const result = await db.get(sql, [plan_name]);
    if (!result) {
        throw new Error(`Price plan ${plan_name} not found. Please enter a valid price plan.`);
    }

    let cost = 0;
    const action = actions.split(',');
    for (let i = 0; i < action.length; i++) {
        const input = action[i].trim();
        if (!result.hasOwnProperty(input + '_price')) {

            throw new Error(`The price plan '${plan_name}' only takes call and sms.`);
        }
        cost += result[input + '_price'];
    }
    return 'R' + cost.toFixed(2);
}

// Create a Price plan

export async function createPlans(plan_name, sms_price, call_price, id) {
    if (!plan_name || !sms_price || !call_price) {
        throw new Error('Not all the fields are filled')
    }
    const sql = `insert into price_plan (plan_name, sms_price, call_price, id) values (?, ?, ?, ?)`
    await db.run(sql, [plan_name, sms_price, call_price, id]);

    
}

// Update a Price Plan
export async function updatePlans(plan_name, sms_price, call_price, id) {
    if (!plan_name || !id ) {
        throw new Error(` Please type a valid Price Plan and/or id`);
    }
    const sql = `update price_plan set plan_name = ?, sms_price = ?, call_price = ? where id = ?`;
    await db.run(sql, [plan_name, sms_price, call_price, id])
}

// Delete a Price Plan

export async function deletePlans(id) {
    const sql = `delete from price_plan where id = ?`;
    await db.run(sql, [id])
}

// const del = await deletePlan(4);


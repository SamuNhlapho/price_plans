import express from 'express';
import { allPlans, totalBill, createPlans, updatePlans, deletePlans } from './db.js';

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/api/price_plans/', async (req, res) => {
    const plans = await allPlans();
    res.json({
        plans: plans
    })
})

app.post('/api/phonebill/', async (req, res) => {
    const plan_name = req.body.plan_name;
    const actions = req.body.actions;

    try{
    const total = await totalBill(plan_name, actions);
    const userActions = { plan_name, actions, total };

    if (!req.app.locals.userActions){
        req.app.locals.userActions = [];
    }

    req.app.locals.userActions.push(userActions);
    res.json({
        total: total,
        message: `The total Bill for '${plan_name}' is '${total}'`,
        userActions: userActions
    });
    } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    });

    app.get('/api/phonebill/', (req, res) => {
        const userActions = req.app.locals.userActions;
    
        if (!userActions) {
            return res.json({
                message: `You have not used any of the plan products`
            });
        }
    
        res.json({
            userActions: userActions
        });
    });
    

app.delete('/api/phonebill/', async (req, res) => {
    req.app.locals.userActions = [];
    res.json({
        message: 'You have deleted your Phone Bill History'
    }) 
})

app.post('/api/price_plan/create', async (req, res) => {
    const plan_name = req.body.plan_name;
    const sms_price = req.body.sms_price;
    const call_price = req.body.call_price;
try {
    await createPlans(plan_name, sms_price, call_price);

    res.json({
        message: `You have successfully created the price plan '${plan_name}'`,
    })
} catch(error) {
    res.status(400).json({
        message: error.message
})}
    
}) 

app.post('/api/price_plan/update', async (req, res) => {
    const plan_name = req.body.plan_name;
    const sms_price = req.body.sms_price;
    const call_price = req.body.call_price;
    const id = req.body.id;
try{
    await updatePlans(plan_name, sms_price, call_price, id);

    res.json({
        message: `You have successfully updated the price plan '${plan_name}'`,
    })
} catch(error){
    res.status(400).json({
        message: error.message
})}
})

app.post('/api/price_plan/delete', async (req, res) => {
    const id = req.body.id;

    await deletePlans(id);

    res.json({
        message: `The Plan Name with id ${id} has been deleted`
    })
}) 


const PORT = process.env.PORT || 4011;
app.listen(PORT, () => `Server started on port: ${PORT}`)


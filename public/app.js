document.addEventListener('alpine:init', () => {
  Alpine.data('price_plans', function () {
    return {
      myPlans: [],
      open: false,
      billName: '',
      billInput: '',
      billMessage: '',
      // error: 'Input valid Plan Name and Bill',
      totalBill: 0,
      userPlanName: '',
      userSMSPrice: '',
      userCallPrice: '',
      userPlanMessage: '',
      planName: '',
      smsPrice: '',
      callPrice: '',
      planUpdateID: '',
      updateMessage: '',
      storePlan: [],
      delMessage: '',
      planDelMessage: '',
      pricePlanErrorMessage: '',
      updateErrorMessage: '',
      billError: '',
      storeMessage: '',
      delID: '',

      calculateBill(billName, billInput) {
        return axios
          .post('/api/phonebill/', {
            "plan_name": billName,
            "actions": billInput
          }).then(result => {
            this.totalBill = result.data.total;
            this.billMessage = result.data.message;
          
          setTimeout(() => {
            this.billMessage = '';
            window.location.reload();
          }, 3000)
          }).catch(error => {
            this.billError = error.response.data.message;

            setTimeout(() => {
              this.billError = '';
            }, 3000)
          })
      },

      storeBill(){
        axios 
          .get('/api/phonebill/')
          .then(result => {
            this.storePlan = result.data.userActions;
          })
      },

      deleteBillCalculation(){
        return axios
          .delete('/api/phonebill/')
          .then(result => {
            this.delMessage = result.data.message;
          setTimeout(() => {
            this.delMessage = '';
            window.location.reload()
          }, 3000)
          }) 
      },

      userPlan(userPlanName, userSMSPrice, userCallPrice) {
        return axios
          .post('/api/price_plan/create', {
            "plan_name": userPlanName,
            "sms_price": userSMSPrice,
            "call_price": userCallPrice
          }).then(result => {
            this.userPlanMessage = result.data.message;
          
            setTimeout(() => {
              this.userPlanMessage = '';
              window.location.reload();
            }, 3000)
          }).catch(error => {
            this.pricePlanErrorMessage = error.response.data.message;
          setTimeout(() => {
            this.pricePlanErrorMessage = '';
          }, 3000)
      })
      }, 

      planUpdate(planName, smsPrice, callPrice, planUpdateID) {
        return axios 
          .post('/api/price_plan/update', {
            "plan_name": planName,
            "sms_price": smsPrice,
            "call_price": callPrice,
            "id": planUpdateID
          }).then(result => {
            this.updateMessage = result.data.message;
          
          setTimeout(() => {
            this.updateMessage = '';
            window.location.reload();
          }, 3000)
          }).catch(error => {
            this.updateErrorMessage = error.response.data.message;
          setTimeout(() => {
            this.updateErrorMessage = '';
          }, 3000)
      })
      },

      deletePlan(delID){
        return axios
            .post('/api/price_plan/delete', {
              "id": delID
            }).then(result => {
              this.planDelMessage = result.data.message;
            
              setTimeout(() => {
                this.planDelMessage = '';
                window.location.reload();
              }, 3000)
            })
      },

      init() {

        axios
          .get('/api/price_plans/')
          .then(result => {
            this.myPlans = result.data.plans;
          });
          this.storeBill();
      },

    }
  })
})
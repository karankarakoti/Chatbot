'use strict'

const dialogflow=require('dialogflow');
const structjson=require('./structjson');
const config=require('../config/keys');
const mongoose=require('mongoose');

const googleAuth=require('google-oauth-jwt');

const projectId=config.googleProjectID;
const sessionId=config.dialogFlowSessionID;
const languageCode=config.dialogFlowSessionLanguageCode;

const credentials={
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey,
};

const sessionClient= new dialogflow.SessionsClient({projectId, credentials});

const Registration=mongoose.model('registration');

module.exports={

    getToken:async function(){
        return new Promise((resolve)=>{
            googleAuth.authenticate(
                {
                    email:config.googleClientEmail,
                    key:config.googlePrivateKey,
                    scopes:['https://www.googleapis.com/auth/cloud-platform'],
                },
                (err,token)=>{
                    resolve(token);
                },
            );
        });
    },

    textQuery: async function(text,userID, parameters={}){
        
        let self=module.exports;
        let sessionPath=sessionClient.sessionPath(projectId,sessionId + userID);
        const request={
            session: sessionPath,
            queryInput:{
                text:{
                    text:text,
                    languageCode:languageCode,
                },
            },
            queryParams:{
                payload:{
                    data:parameters
                }
            }
        };
        let responses=await sessionClient.detectIntent(request);
        responses=await self.handleAction(responses);
        return responses;
    },

    eventQuery: async function(event,userID, parameters={}){
        let self=module.exports;
        let sessionPath=sessionClient.sessionPath(projectId,sessionId + userID);
        const request={
            session: sessionPath,
            queryInput:{
                event:{
                    name:event,
                    parameters:structjsnon.jsonToStructProto(parameters),
                    languageCode:languageCode,
                },
            }
        };
        let responses=await sessionClient.detectIntent(request);
        responses= self.handleAction(responses);
        return responses;
    },

    handleAction:function(responses){
        let self=module.exports;
        let queryResult=responses[0].queryResult;

        switch(queryResult.action){
            case 'recommend yes':
                if(queryResult.allRequiredParamsPresent){
                    self.saveRegistration(queryResult.parameters.fields);
                }
                break;
        }
        return responses;
    },

    saveRegistration:async function(fields){
        const registration=new Registration({
            name:fields.name.stringValue,
            address:fields.address.stringValue,
            phone:fields.phone.stringValue,
            email:fields.email.stringValue,
            datesent:Date.now()
        });
        try{
            let reg=await registration.save();
            console.log(reg);
        }
        catch(err)
        {
            console.log(err);
        }
    }
}
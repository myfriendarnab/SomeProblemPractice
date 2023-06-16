//this script adds and refreshes jwt token(access token) to your postman calls
const __main__=(headerInputs, resetheaderinputs, isTrace)=>{
    // if(isTrace)
    //     console.log(headerInputs);

    if (isFetchToken(headerInputs.authz.jwtinfo.payload, headerInputs.authz.jwtinfo.expires, isTrace)) {
        const echoPostRequest = {
        url: headerInputs.authz.tokenendpoint,
        method: 'POST',
        header: {
                'content-type': 'application/json',
                'accept': 'application/json'
        },
        body: JSON.stringify({ 
                "UserID": headerInputs.authz.userid, 
                "Password": headerInputs.authz.password, 
                "SignedTokenOnly": true
            })};
        pm.sendRequest(echoPostRequest, function (err, res) {
            if (err) {
                console.log( "An error happened");
                console.log(err ? err : res.json());
            } else {
                callBackSuccess(res, headerInputs.authz.jwtinfo.expires, isTrace);
            }
        });
    }
	headerInputs=resetheaderinputs();
    // setGatewayHeaders(headerInputs.apiclient.id, headerInputs.apiclient.secret, headerInputs.authz.jwtinfo.payload, isTrace);
};

function callBackSuccess(res, accessTokenExpiry, isTrace){
	if(isTrace){
        console.log('INSIDE callBackSuccess');
        console.log('accessTokenExpiry: '+accessTokenExpiry);
    }
    var jsonData = res.json();
    if(jsonData && jsonData.signedJWT){
        pm.environment.set('currentAccessToken', jsonData.signedJWT)
    }

    var jwtInfo ={};
    jwtInfo.payload = parseJwt(jsonData.signedJWT,1);
    jwtInfo.expires = jwtInfo.payload.exp;
    if(isTrace)
        console.log(jwtInfo);

    if(isTokenExpired(accessTokenExpiry, isTrace)){
        pm.environment.set('accessTokenExpiry', jwtInfo.payload.exp);
    }
};

function isFetchToken(currentAccessToken, accessTokenExpiry, isTrace){
	if(isTrace)
        console.log('INSIDE isFetchToken')
    if ((!accessTokenExpiry) || (!currentAccessToken)) {
        if(isTrace)
            console.log('Token or expiry date are missing');
        return true;
    } else if (isTokenExpired(accessTokenExpiry, isTrace)) {
        if(isTrace)
            console.log('Token is expired');
        return true;
    } else {
        if(isTrace)
            console.log('Token and expiry date are all good');
        return false;
    }
}

function setGatewayHeaders(clientId, clientSecret, currentAccessToken, isTrace){
	if(isTrace){
        console.log('INSIDE setGatewayHeaders')
    }
    //add client-id
    pm.request.headers.add({
        'key': "X-IBM-Client-Id",
        'value': clientId
    });

    //add client-secret
    pm.request.headers.add({
        'key': "X-IBM-Client-Secret",
        'value': clientSecret
    });

    //add auth header
    pm.request.headers.add({
        'key': "Authorization",
        'value': 'Bearer ' + currentAccessToken 
    });
}

function parseJwt (token,part) {
   var base64Url = token.split('.')[part];
   var words = CryptoJS.enc.Base64.parse(base64Url);
   var jsonPayload = CryptoJS.enc.Utf8.stringify(words);
   return  JSON.parse(jsonPayload);
};

function isTokenExpired(accessTokenExpiry, isTrace){
    var expval = accessTokenExpiry;
    if(expval){
            if(isTrace)
                console.log('expiry at:' + expval)
            var d = new Date(0);
            var isInSeconds = expval.toString().length<=10;
            if(isTrace)
                console.log('expiration value size:'+ expval.toString().length);
            if(isInSeconds){
                if(isTrace)
                    console.log('setting time in seconds');
                d.setUTCSeconds(expval);
            }
            else{
                if(isTrace)
                    console.log('setting time in milliseconds');
                d.setUTCMilliseconds(expval);
            }
            var d_threshhold = new Date(d-2000); 
            var d_now=new Date();
            if(isTrace){
                printDate(d, 'expiry token');
                printDate(d_threshhold, 'threshhold time');
                printDate(d_now, 'current time');
            }           
            return (d_threshhold<=d_now);
    }
    if(isTrace)
        console.log('No Token value');
    return true;
};

function printDate(dt, comment){
    var day = dt.getDate();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    var ora = dt.getHours();
    var minuti = dt.getMinutes();
    var secondi = dt.getSeconds();

    console.log('epoch time for '+dt.getTime()+ ' of '+ comment +' is:: ' +year+'-'+month+'-'+day+' '+ora+':'+minuti+':'+secondi);
};

//required for refreshing headerinputs, in case new token is generated
var resetheaderinputs = ()=> ({
		apiclient:{
			id:pm.environment.get("clientId"),
			secret:pm.environment.get("clientSecret")
		},
		authz:{
			tokenendpoint:pm.environment.get("token-endpoint"),
			userid:pm.environment.get("userId"),
			password:pm.environment.get("userPassword"),
			jwtinfo:{
				payload:pm.environment.get("currentAccessToken"),
				expires:pm.environment.get("accessTokenExpiry")
			}
		}
	});

var headerInputs=resetheaderinputs();
var isTrace = true;

__main__(headerInputs, resetheaderinputs, isTrace);
console.log(headerInputs);
setGatewayHeaders(headerInputs.apiclient.id, headerInputs.apiclient.secret, headerInputs.authz.jwtinfo.payload, isTrace);
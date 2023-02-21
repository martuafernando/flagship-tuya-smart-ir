# Documentation

### GET /{infrared_id}/brand

#### Params 

>| Name         	| Type    	| IN    	| Default 	| Required 	| Description                     	|
>|--------------	|---------	|-------	|---------	|----------	|---------------------------------	|
>| infrared_id  	| String  	| uri   	|         	| Yes      	| The device ID.                  	|
>| category_id  	| Integer 	| uri   	| 5        	| No      	| The ID of a specified category. 	|
>| country_code 	| String  	| query 	| ID       	| No       	| The country code.               	|

#### Response

Response content type : application/json

```json
{
  "success": Boolean,
  "data": [
    {
      "brand_id": Integer,
      "brand_name": String
    }
    ...
  ]
}
```

### GET /{infrared_id}/remote

#### Params

>| Name         	| Type    	| IN    	| Default 	| Required 	| Description                     	|
>|--------------	|---------	|-------	|---------	|----------	|---------------------------------	|
>| infrared_id  	| String  	| uri   	|         	| Yes      	| The device ID.                  	|

#### Response

```json
{
  "success": Boolean,
  "data" : [
    {
      "area_id": Integer,
      "brand_id": Integer,
      "brand_name": String,
      "category_id": Integer,
      "operator_id": Integer,
      "remote_id": String,
      "remote_index": Integer,
      "remote_name": String,
    }
    ...
  ]
}
```

### GET /{infrared_id}/{remote_id}/key

#### Params

>| Name         	| Type    	| IN    	| Default 	| Required 	| Description                     	|
>|--------------	|---------	|-------	|---------	|----------	|---------------------------------	|
>| infrared_id  	| String  	| uri   	|         	| Yes      	| The device ID.                  	|
>| remote_id  	| String  	| uri   	|         	| Yes      	| The remote ID.                  	|

#### Response

```json
{
  "success": Boolean,
  "data": {
    "key_list" : [
      {
        "key": String,
        "key_id": Integer,
        "key_name": String,
        "standard_key": Boolean
      },
      ...
    ],
    "key_range" : [
      {
        "mode": Integer,
        "mode_name": String,
        "temp_list": [
          {
            "temp": Integer,
            "temp_name": String,
            "fan_list": [
              {
                "fan": Integer,
                "fan_name": String,
              },
              ...
            ]
          },
          ...
        ]
      },
      ...
    ]
  }
}
```

### POST /{infrared_id}/{remote_id}/command

#### Params

>| Name         	| Type    	| IN    	| Default 	| Required 	| Description                     	|
>|--------------	|---------	|-------	|---------	|----------	|---------------------------------	|
>| infrared_id  	| String  	| uri   	|         	| Yes      	| The device ID.                  	|
>| remote_id  	| String  	| uri   	|         	| Yes      	| The remote ID.                  	|

#### Body

>| Name         	| Type    	| Required 	| Description                                 	|
>|--------------	|---------	|----------	|---------------------------------------------	|
>| code         	| String  	| No       	| The command.                                	|
>| value        	| Object  	| No       	| The command value.                          	|

> Code and value guides

| Name  	| Type    	| Required 	| Description                                                                                                                        	|
|-------	|---------	|----------	|------------------------------------------------------------------------------------------------------------------------------------	|
| power 	| Integer 	| No       	| The power supply. Valid values:<br>`0`: power off.<br>`1`: power on.                                                               	|
| mode  	| Integer 	| No       	| The working mode. Valid values:<br>`0`: cooling.<br>`1`: heating.<br>`2`: automatic.<br>`3`: air supply.<br>`4`: dehumidification. 	|
| temp  	| Integer 	| No       	| The temperature.                                                                                                                   	|
| swing 	| Integer 	| No       	| The swing mode (not supported currently).                                                                                          	|
| wind  	| Integer 	| No       	| The wind speed. Valid values:<br>`0`: automatic.<br>`1`: low speed.<br>`2`: medium speed.<br>`3`: high speed.                      	|

### Response

```json
{
  "success": Boolean,
  "data" : Boolean
}
```
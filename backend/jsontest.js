const JSON_TEXT = `[
{ "driver_code": "VER", "position": "P1", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "HAM", "position": "P2", " penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "ALO", "position": "P3", " penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "RUS", "position": "P4", " penalty": 5, "remarks": "Collision with another driver" },
{ "driver_code": "LEC", "position": "P5", " penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "SAI", "position": "P6", " penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "PER", "position": "P7", " penalty": 10, "remarks": "Unsafe pit release" },
{ "driver_code": "NOR", "position": "P8", " penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "PIA", "position": "P9", " penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "OCO", "position": "P10", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "GAS", "position": "P11", "penalty": 5, "remarks": "Track limits violation" },
{ "driver_code": "TSU", "position": "P12", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "RIC", "position": "P13", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "BOT", "position": "P14", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "ZHO", "position": "P15", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "MAG", "position": "P16", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "HUL", "position": "P17", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "ALB", "position": "P18", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "STR", "position": "P19", "penalty": 0, "remarks": "Clean Race" },
{ "driver_code": "SAR", "position": "P20", "penalty": 0, "remarks": "Clean Race" }
]`


const template = `{ "driver_code": ${driver.code}, "position": ${(isDNF) ? "DNF" : `P${index + 1}`}, "penalty": ${penalty}, "remarks": ${(remarks.value) ? remarks.value : "Clean Race"} }`

console.log(JSON.parse(JSON_TEXT));
import random

uid = '4188925c-e00e-43f2-b930-074f83783925'
datapts = 300;
for i in range (1, datapts):
    aid     = random.randint(1, 51)
    eid     = random.randint(1, 197) 
    weight  = random.randint(0, 100)
    rep     = random.randint(6, 12)
    sets    = random.randint(1, 5)
    
    print(f'{uid},{aid},,{eid},{weight},{rep},{sets}')
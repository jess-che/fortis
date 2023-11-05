import random

# uid, aid, seq_num, eid, weight, rep, set
uid = 'b24e24f4-86b8-4b83-8947-b2472a43b436'
datapts = 600;
for i in range (1, datapts):
    aid     = random.randint(1, 70)
    eid     = random.randint(1, 197) 
    weight  = random.randint(0, 100)
    rep     = random.randint(6, 12)
    sets    = random.randint(1, 5)
    
    print(f'{uid},{aid},,{eid},{weight},{rep},{sets}')
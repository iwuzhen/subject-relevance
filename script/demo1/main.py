# 提取

import requests
import pandas as pd

Subjects = ["Biology","Chemistry","Physics","Engineering disciplines","Mathematics","Psychology","Computer science","Economics","Sociology","Political science","Philosophy"]

def main():
    url = "https://lmd.wiki.knogen.com:10443/api/mag/getYinguoData"
    year = 1986
    data = {
        'db': "mag",
        'from': year,
        'method': "linksout",
        'strA': "Physics",
        'strB': ",".join(Subjects),
        'to': year,
        'type': 1
    }
    ret_list = []
    for subject in Subjects:
        data['strA'] = subject
        rep = requests.post(url,json=data)
        print(rep.json())
        repData = rep.json()["data"]
        retDict = {"name":subject}
        for val,key in zip(repData["y"],repData["legend"]):
            key = key.replace(f"{subject}-","")
            if val[0] > 0:
                retDict[key] = val[0] 
        ret_list.append(retDict)
    ret_list.sort(key=lambda x:-len(x))
    df=pd.DataFrame(ret_list)
    Subjects.remove("Philosophy")
    print(df)
    df = df[["name"]+Subjects]
    df.to_csv("tmp.csv", index=False)

        # print(rep.json()["data"])
        
if __name__ == "__main__":
    main()
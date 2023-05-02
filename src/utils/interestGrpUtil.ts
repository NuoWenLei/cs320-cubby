import { Group } from "./types"

/**
 * give a list of Groups, separated them into fridn groups and interest groups. 
 * Based on friend_group attribute
 */


export function interestOrFriend(groupList: Group[]): Map<string, Group[]> {

    let groupMap: Map<string, Group[]> = new Map<string, Group[]>();

    for (let group of groupList) {
        if (group.friend_group === true) {
            if (groupMap.get("friendG") === undefined) {
                groupMap.set("friendG", []);
            }
            groupMap.get("friendG")?.push(group);
        }
        else {
            if (groupMap.get("interestG") === undefined) {
                groupMap.set("interestG", []);
            }
            groupMap.get("interestG")?.push(group);
        }
    }
    return groupMap;
}

//returns a list of friend groups 

export function getFriendG(groupMap: Map<string, Group[]>) {
    let friendGroupList: Group[] | undefined = groupMap.get("friendG");

    if (friendGroupList === undefined) {
        return [];
    }
    else {
        return friendGroupList;
    }
}


//returns a list of interest groups

export function getInterestG(groupMap: Map<string, Group[]>) {
    let interestGroupList: Group[] | undefined = groupMap.get("interestG");

    if (interestGroupList === undefined) {
        return [];
    }
    else {
        return interestGroupList;
    }
}



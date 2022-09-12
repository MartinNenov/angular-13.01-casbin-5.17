const actionGroups: { [key: string]: string } = {};
actionGroups['$VIEW'] = "$VIEW";
actionGroups["$CREATE"] = "$CREATE";
actionGroups["$EDIT"] = "$EDIT";
actionGroups["$DELETE"] = "$DELETE";

function crudMatch(rAct: string, pAct: string) {
  if (!pAct || !actionGroups[pAct]) {
    return false;
  }

  if (pAct === actionGroups['$VIEW']) {
    return /^(find|read|list|view|get|select|count|enum)/gi.test(rAct);
  }

  if (pAct === actionGroups['$CREATE']) {
    return /^(write|create|insert|generate|import|new)/gi.test(rAct);
  }

  if (pAct === actionGroups['$EDIT']) {
    return /^(update|set|upd)/gi.test(rAct);
  }

  if (pAct === actionGroups['$DELETE']) {
    return /^(cancel|drop|remove|delete|del)/gi.test(rAct);
  }

  return false;
}

export { actionGroups, crudMatch };

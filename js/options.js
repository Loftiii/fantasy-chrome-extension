let currentLeague = null;
let leagueDBNames = null;
let leagueNameMap = null;
const container = document.getElementById('container-body');
const leagueSelector = document.getElementById('league-selector');
const categories = document.getElementsByClassName('category');
const leagueDatabase = {};
leagueDatabase.webdb = {};
leagueDatabase.webdb.db = null;
const saveButton = document.getElementById('save');
const resetButton = document.getElementById('reset');
const scriptButton = document.getElementById('script');
const customScript = document.getElementById('custom-script');
const QBG = document.getElementById('QBG');
const QBGName = document.getElementById('QBG-Name');
const QBGDate = document.getElementById('QBG-Date');
const QBS= document.getElementById('QBS');
const QBSName= document.getElementById('QBS-Name');
const QBSDate= document.getElementById('QBS-Date');
const RBG = document.getElementById('RBG');
const RBGName = document.getElementById('RBG-Name');
const RBGDate = document.getElementById('RBG-Date');
const RBS = document.getElementById('RBS');
const RBSName = document.getElementById('RBS-Name');
const RBSDate = document.getElementById('RBS-Date');
const WRG = document.getElementById('WRG');
const WRGName = document.getElementById('WRG-Name');
const WRGDate = document.getElementById('WRG-Date');
const WRS = document.getElementById('WRS');
const WRSName = document.getElementById('WRS-Name');
const WRSDate = document.getElementById('WRS-Date');
const TEG = document.getElementById('TEG');
const TEGName = document.getElementById('TEG-Name');
const TEGDate = document.getElementById('TEG-Date');
const TES = document.getElementById('TES');
const TESName = document.getElementById('TES-Name');
const TESDate = document.getElementById('TES-Date');
const DSTG = document.getElementById('DSTG');
const DSTGName = document.getElementById('DSTG-Name');
const DSTGDate = document.getElementById('DSTG-Date');
const DSTS = document.getElementById('DSTS');
const DSTSName = document.getElementById('DSTS-Name');
const DSTSDate = document.getElementById('DSTS-Date');
const KG = document.getElementById('KG');
const KGName = document.getElementById('KG-Name');
const KGDate = document.getElementById('KG-Date');
const KS = document.getElementById('KS');
const KSName = document.getElementById('KS-Name');
const KSDate = document.getElementById('KS-Date');

const showLoserCheckbox = document.getElementById('losers-show');
const show3rdPlaceCheckbox = document.getElementById('3rd-show');
const hideAverageLineCheckbox = document.getElementById('acuna-show');
const collapseIconsCheckbox = document.getElementById('collapse-icons');
const averageLineNameInput = document.getElementById('acuna-name');
const lastPlaceNameInput = document.getElementById('sacko-name');
const hideTeamNamesCheckbox = document.getElementById('team-name-show');
const showPicturesCheckbox = document.getElementById('pictures-show');
const playerRecordHideCheckbox = document.getElementById('player-record-hide');

const leaderBoardOptionsDiv = document.getElementById('leader-board-options');
const managerOptionsDiv = document.getElementById('manager-options');
const recordBoardOptionsDiv = document.getElementById('record-board-options');
const powerRankingOptionsDiv = document.getElementById('power-ranking-options');

const managerTable = document.getElementById('manager-override');
const managerImageTable = document.getElementById('pictures-override');
const sackoTable = document.getElementById('sacko-override');

let os = 'mac';
let numColumns = 60;

const errorHandler = (transaction, error) => {
  alert("Error processing SQL: "+ error.message);
  return true;
}

let yearArray = [];
let managerArray = [];
let managerYearMap = {};
let managerImageMap = {};
let sackoMap = null;
let managerMap = null;
let lastSync = null;

for(var h = 0; h < categories.length; h++) {
  ((index) => {
    categories[index].addEventListener("click", () => {
      if(categories[index].className.indexOf('inactive') > -1) {
        for(var j = 0; j < categories.length; j++) {
          categories[j].classList.remove('inactive');
          categories[j].classList.add('inactive');
        }
        categories[index].classList.remove('inactive');
      }
    });
  })(h);
}

show3rdPlaceCheckbox.addEventListener('change', (event) => {
  alert("Changing this setting will require the database be refreshed for the change to affect already recorded records.");
});

leagueSelector.addEventListener('change', (event) => {
  currentLeague = event.target.value;
  updateOptionsForLeague();
});

showLoserCheckbox.addEventListener('change', (event) => {
  alert("Changing this setting will require the database be refreshed for the change to affect already recorded records.");
});

const updateOptionsForLeague = () => {
  yearArray = []; managerArray = [];
  managerYearMap = {};
  managerImageMap = {};
  sackoMap = null; managerMap = null; lastSync = null;
  leagueDatabase.webdb.open = () => {
    var dbSize = 5 * 1024 * 1024; // 5MB
    leagueDatabase.webdb.db = openDatabase((currentLeague), "1", "League Database", dbSize);
  }

  leagueDatabase.webdb.open();
  chrome.storage.sync.get([currentLeague], (response) => {
    const data = response[currentLeague];
    lastSync = data.lastSync;
    QBG.value = (data.QBG) ? data.QBG.score : null;
    QBS.value = (data.QBS) ? data.QBS.score : null;
    RBG.value = (data.RBG) ? data.RBG.score : null;
    RBS.value = (data.RBS) ? data.RBS.score : null;
    WRG.value = (data.WRG) ? data.WRG.score : null;
    WRS.value = (data.WRS) ? data.WRS.score : null;
    TEG.value = (data.TEG) ? data.TEG.score : null;
    TES.value = (data.TES) ? data.TES.score : null;
    DSTG.value = (data.DSTG) ? data.DSTG.score : null;
    DSTS.value = (data.DSTS) ? data.DSTS.score : null;
    KG.value = (data.KG) ? data.KG.score : null;
    KS.value = (data.KS) ? data.KS.score : null;

    QBGName.value = (data.QBG) ? data.QBG.name : null;
    QBSName.value = (data.QBS) ? data.QBS.name : null;
    RBGName.value = (data.RBG) ? data.RBG.name : null;
    RBSName.value = (data.RBS) ? data.RBS.name : null;
    WRGName.value = (data.WRG) ? data.WRG.name : null;
    WRSName.value = (data.WRS) ? data.WRS.name : null;
    TEGName.value = (data.TEG) ? data.TEG.name : null;
    TESName.value = (data.TES) ? data.TES.name : null;
    DSTGName.value = (data.DSTG) ? data.DSTG.name : null;
    DSTSName.value = (data.DSTS) ? data.DSTS.name : null;
    KGName.value = (data.KG) ? data.KG.name : null;
    KSName.value = (data.KS) ? data.KS.name : null;

    QBGDate.value = (data.QBG) ? data.QBG.date : null;
    QBSDate.value = (data.QBS) ? data.QBS.date : null;
    RBGDate.value = (data.RBG) ? data.RBG.date : null;
    RBSDate.value = (data.RBS) ? data.RBS.date : null;
    WRGDate.value = (data.WRG) ? data.WRG.date : null;
    WRSDate.value = (data.WRS) ? data.WRS.date : null;
    TEGDate.value = (data.TEG) ? data.TEG.date : null;
    TESDate.value = (data.TES) ? data.TES.date : null;
    DSTGDate.value = (data.DSTG) ? data.DSTG.date : null;
    DSTSDate.value = (data.DSTS) ? data.DSTS.date : null;
    KGDate.value = (data.KG) ? data.KG.date : null;
    KSDate.value = (data.KS) ? data.KS.date : null;

    showLoserCheckbox.checked = (data.trackLosers) ? data.trackLosers : false;
    show3rdPlaceCheckbox.checked = (data.track3rdPlaceGame) ? data.track3rdPlaceGame : false;
    hideAverageLineCheckbox.checked = (data.hideAverageLine) ? data.hideAverageLine : false;
    averageLineNameInput.value = (data.averageLineName) ? data.averageLineName : null;
    lastPlaceNameInput.value = (data.lastPlaceName) ? data.lastPlaceName : null;
    hideTeamNamesCheckbox.checked = (data.hideTeamNames) ? data.hideTeamNames : false;
    showPicturesCheckbox.checked = (data.showTeamPictures) ? data.showTeamPictures : false;
    collapseIconsCheckbox.checked = (data.areIconsCollapsed) ? data.areIconsCollapsed : false;
    playerRecordHideCheckbox.checked = (data.hidePlayerRecords) ? data.hidePlayerRecords : false;

    //get options from database
    const query = 'SELECT DISTINCT year FROM matchups';
    const query2 = 'SELECT DISTINCT manager, year FROM matchups';
    leagueDatabase.webdb.db.transaction((tx) => {
      tx.executeSql(query, [],
        (tx, rs) => {
          for(var i = 0; i < rs.rows.length; i++) {
            yearArray.push(rs.rows[i].year);
          }
          tx.executeSql(query2, [],
            (tx, rs2) => {
              for(var m = 0; m < rs2.rows.length; m++) {
                if(managerYearMap[rs2.rows[m].year]) {
                  managerYearMap[rs2.rows[m].year].push(rs2.rows[m].manager);
                } else {
                  managerYearMap[rs2.rows[m].year] = [rs2.rows[m].manager];
                }
                if(managerArray.indexOf(rs2.rows[m].manager) === -1){
                  managerArray.push(rs2.rows[m].manager);
                }
              }
              sackoMap = (data.sackoMap) ? data.sackoMap : {};
              managerMap = (data.managerMap) ? data.managerMap : {};
              managerImageMap = (data.managerImageMap) ? data.managerImageMap : {};
              populateManagerAlias(managerArray);
              populateLastPlaceSelection(yearArray, sackoMap, managerYearMap);
              populateManagerImageOverride(managerArray);
            }, errorHandler);
        }, errorHandler);
      });
  });
}

chrome.runtime.getPlatformInfo(function(info) {
  os = info.os;
  chrome.storage.sync.get(['leagueDBNames','leagueNameMap'], (result) => {
    leagueDBNames = result.leagueDBNames;
    leagueNameMap = result.leagueNameMap;
    currentLeague = (leagueDBNames && leagueDBNames.length > 0) ? leagueDBNames[0] : null;
    if(currentLeague) {
      const options = [];
      for(var i = 0; i < leagueDBNames.length; i++) {
        let selected = (i === 0) ? 'selected' : '';
        options.push(`<option value='${leagueDBNames[i]}' ${selected}>${leagueNameMap[leagueDBNames[i]]}</option>`)
      }
      leagueSelector.innerHTML = options;
      //leagueTitle.innerHTML = result.leagueNameMap[currentLeague];
      updateOptionsForLeague();
    } else {
      resetButton.setAttribute('disabled','disabled');
      saveButton.setAttribute('disabled','disabled');
      container.innerHTML = "<div class='container' style='padding:25px; text-align:center;'>Upload league database before adding league options</div>";
    }
  });
});

const populateManagerImageOverride = (managers) => {
  managerImageTable.innerHTML = "";
  if(managers && managers.length > 0) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const managerHeader = document.createElement('th');
    managerHeader.innerHTML = 'Manager';
    const imageHeader = document.createElement('th');
    imageHeader.innerHTML = 'Image URL';
    const tbody = document.createElement('tbody');
    managerHeader.setAttribute('style','text-align:right;');
    tr.appendChild(managerHeader);
    tr.appendChild(imageHeader);
    thead.appendChild(tr);
    managerImageTable.appendChild(thead);
    managerImageTable.appendChild(tbody);
    managers.forEach((manager) => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      nameCell.setAttribute('style','width: 33%;');
      nameCell.innerHTML = manager + ":";
      const pictureCell = document.createElement('td');
      const pictureInput = document.createElement('input');
      pictureInput.setAttribute('type','text');
      pictureInput.setAttribute('style','margin-left: 5%; width: 90%;');
      let managerValue = (managerImageMap[manager]) ? managerImageMap[manager] : '';
      pictureInput.setAttribute('value', managerValue);
      pictureInput.addEventListener('change', (event) => {
        managerImageMap[manager] = event.target.value;
      });
      pictureCell.appendChild(pictureInput);
      row.appendChild(nameCell);
      row.appendChild(pictureCell);
      managerImageTable.getElementsByTagName( 'tbody' )[0].appendChild(row);
    });
  } else {
    managerImageTable.innerHTML = "<div><span>No matchup data has been uploaded to the database, please come back after having uploaded at least one weekly matchup.</span></div>";
  }
  let tableHeight = window.getComputedStyle(managerImageTable).getPropertyValue('height');
  const newHeight = parseInt(tableHeight.split('px')[0],10) + 105;
  powerRankingOptionsDiv.style['max-height'] = `${newHeight}px`;
}

const populateManagerAlias = (managers) => {
  managerTable.innerHTML = "";
  if(managers && managers.length > 0) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const managerHeader = document.createElement('th');
    managerHeader.innerHTML = 'Manager';
    const aliasHeader = document.createElement('th');
    aliasHeader.innerHTML = 'Alias';
    const tbody = document.createElement('tbody');
    managerHeader.setAttribute('style','text-align:right;');
    tr.appendChild(managerHeader);
    tr.appendChild(aliasHeader);
    thead.appendChild(tr);
    managerTable.appendChild(thead);
    managerTable.appendChild(tbody);
    managers.forEach((manager) => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      nameCell.setAttribute('style','width: 33%;');
      nameCell.innerHTML = manager + ":";
      const aliasCell = document.createElement('td');
      const aliasInput = document.createElement('input');
      aliasInput.setAttribute('type','text');
      aliasInput.setAttribute('style','margin-left: 5%; width: 90%;');
      let managerValue = (managerMap[manager]) ? managerMap[manager] : '';
      aliasInput.setAttribute('value', managerValue);
      aliasInput.addEventListener('change', (event) => {
        managerMap[manager] = event.target.value;
      });
      aliasCell.appendChild(aliasInput);
      row.appendChild(nameCell);
      row.appendChild(aliasCell);
      managerTable.getElementsByTagName( 'tbody' )[0].appendChild(row);
    });
  } else {
    managerTable.innerHTML = "<div><span>No matchup data has been uploaded to the database, please come back after having uploaded at least one weekly matchup.</span></div>";
  }

  let tableHeight = window.getComputedStyle(managerTable).getPropertyValue('height');
  const newHeight = parseInt(tableHeight.split('px')[0],10) + 11;
  managerOptionsDiv.style['max-height'] = `${newHeight}px`;
}

const populateLastPlaceSelection = (years, sackoMap, owners) => {
  sackoTable.innerHTML = "";
  if(years.length > 0) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const managerHeader = document.createElement('th');
    managerHeader.innerHTML = 'Manager';
    const yearHeader = document.createElement('th');
    yearHeader.innerHTML = 'Year';
    const tbody = document.createElement('tbody');
    tr.appendChild(yearHeader);
    tr.appendChild(managerHeader);
    thead.appendChild(tr);
    sackoTable.appendChild(thead);
    sackoTable.appendChild(tbody);
    years.forEach((year) => {
      const row = document.createElement('tr');
      const yearCell = document.createElement('td');
      yearCell.innerHTML = year;
      const managerCell = document.createElement('td');
      managerCell.appendChild(generateManagerDropdown(owners, sackoMap[year], year));
      row.appendChild(yearCell);
      row.appendChild(managerCell);
      sackoTable.getElementsByTagName('tbody')[0].appendChild(row);
    })
  } else {
    sackoTable.innerHTML = "<div><span>No matchup data has been uploaded to the database, please come back after having uploaded at least one weekly matchup.</span></div>";
  }

  let tableHeight = window.getComputedStyle(sackoTable).getPropertyValue('height');
  const newHeight = parseInt(tableHeight.split('px')[0],10) + 149;
  leaderBoardOptionsDiv.style['max-height'] = `${newHeight}px`;
}

const generateManagerDropdown = (managers, selectedManager, year) => {
  let selectManager = document.createElement('select');
  selectManager.setAttribute('data-year', year);
  selectManager.addEventListener('change', (event) => {
    sackoMap[event.target.getAttribute('data-year')] = event.target.value;
  });
  let noneOption = document.createElement('option');
  noneOption.setAttribute('value', 'none');
  noneOption.innerHTML = '';
  selectManager.appendChild(noneOption);

  managers[year].forEach((manager) => {
    let managerOption = document.createElement('option');
    managerOption.setAttribute('value', manager);
    managerOption.innerHTML = manager;
    if(manager === selectedManager) {
      managerOption.setAttribute('selected', 'selected');
    }
    selectManager.appendChild(managerOption);
  })
  return selectManager;
}


saveButton.onclick = (element) => {
  const savedObject = {};
  savedObject[currentLeague] = {QBG: { score: QBG.value, name: QBGName.value, date: QBGDate.value }, QBS: { score: QBS.value, name: QBSName.value, date: QBSDate.value }, RBG: { score: RBG.value, name: RBGName.value, date: RBGDate.value }, RBS: { score: RBS.value, name: RBSName.value, date: RBSDate.value },
    WRG: { score: WRG.value, name: WRGName.value, date: WRGDate.value }, WRS: { score: WRS.value, name: WRSName.value, date: WRSDate.value }, TEG: { score: TEG.value, name: TEGName.value, date: TEGDate.value }, TES: { score: TES.value, name: TESName.value, date: TESDate.value },
    DSTG: { score: DSTG.value, name: DSTGName.value, date: DSTGDate.value }, DSTS: { score: DSTS.value, name: DSTSName.value, date: DSTSDate.value }, KG: { score: KG.value, name: KGName.value, date: KGDate.value }, KS: { score: KS.value, name: KSName.value, date: KSDate.value },
    lastSync: lastSync, sackoMap: sackoMap, managerMap: managerMap, managerImageMap: managerImageMap, lastPlaceName: lastPlaceNameInput.value, averageLineName: averageLineNameInput.value,
    hideAverageLine: hideAverageLineCheckbox.checked, track3rdPlaceGame: show3rdPlaceCheckbox.checked, trackLosers: showLoserCheckbox.checked, hideTeamNames: hideTeamNamesCheckbox.checked, showTeamPictures: showPicturesCheckbox.checked, areIconsCollapsed: collapseIconsCheckbox.checked, hidePlayerRecords: playerRecordHideCheckbox.checked };
  chrome.storage.sync.set(savedObject, () => {
    alert("saved");
  });
};

resetButton.onclick = (element) => {
  updateOptionsForLeague();
}

scriptButton.onclick = (element) => {
  if(confirm('Are you sure you want to run this script?')) {
    leagueDatabase.webdb.db.transaction((tx) => {
      tx.executeSql(customScript.value, [],
        (tx, rs) => {
          customScript.value = "";
          alert('Success');
        });
      }, errorHandler);
  }
}

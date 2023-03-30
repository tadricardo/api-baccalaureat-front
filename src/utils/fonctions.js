import moment from "moment";
import joursFeries from "@socialgouv/jours-feries";

export function compareDateCurrentLessOneDay(string) {
  var today = new Date();
  var date = new Date(string);
  date.setDate(date.getDate() - 1);
  if (today < date) {
    return true;
  } else {
    return false;
  }
}
export function compareDateStringWithDateCurrent(string) {
  let datePoste = new Date(string).getTime();
  let dateCurrent = new Date().getTime();
  if (datePoste < dateCurrent) {
    return false;
  } else {
    return true;
  }
}

export function compareTwoDateString(date1, date2) {
  let dateA = new Date(date1).getTime();
  let dateB = new Date(date2).getTime();
  if (dateA > dateB) {
    return "+";
  } else if (dateA < dateB) {
    return "-";
  } else {
    return "=";
  }
}

export function ifNumber(number) {
  const regex = /^[0-9\b]+$/;
  if (regex.test(number)) {
    return true;
  }
  else {
    return false;
  }
}

export function ifNumberWithDecimal(number) {
  const regex = /^\d*\.?\d*$/;
  if (regex.test(number)) {
    return true;
  } else {
    return false;
  }
}

export function isValidDate(value) {
  const dateWrapper = new Date(value);
  return !isNaN(dateWrapper.getDate());
}
/**
 * 
 * @param {date} value 
 * @returns Age par rapport a la date en cours
 */
export function isMajor(value) {
  const years = moment().diff(value, 'years', false);
  if (years >= 18) {
    return true;
  } else {
    return false;
  }

}

export function arrayToObject(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; ++i) {
    obj[i] = arr[i];
  }
  return obj;
}

export function compareDateHighestOrEqualDateCurrent(dateGiven) {
  let date = new Date(dateGiven);
  let dateCurrent = new Date();
  if (date.getTime() >= dateCurrent.getTime()) {
    return true
  } else {
    return false
  }
}

export function ancienneteSalarieMoisAnnees(postes) {
  let tempsMilliSeconde = 0;
  if (postes.length > 0) {
    postes.forEach((poste) => {
      if (new Date(poste.dateFin) > new Date() || poste.dateFin !== null)
        tempsMilliSeconde += ((new Date()) - new Date(poste.dateDebut));
      else
        tempsMilliSeconde += (new Date(poste.dateFin) - new Date(poste.dateDebut));
    });
    if (tempsMilliSeconde > 3.154e+10)
      return new Date(tempsMilliSeconde).getMonth() + " Mois et " + new Date(tempsMilliSeconde).getFullYear() + " Années";
    else if (tempsMilliSeconde > 2.628e+9)
      return new Date(tempsMilliSeconde).getMonth() + " Mois";
    else if (tempsMilliSeconde > 0)
      return new Date(tempsMilliSeconde).getDay() + " Jours";
    else
      return "Aucune ancienneté.";

  } else {
    return "Aucune ancienneté.";
  }
}

export function ancienneteSalarieMoisAnneesParPoste(poste) {
  let tempsMilliSeconde = 0;
  if (new Date(poste.dateFin) > new Date() || poste.dateFin !== null)
    tempsMilliSeconde += ((new Date()) - new Date(poste.dateDebut));
  else
    tempsMilliSeconde += (new Date(poste.dateFin) - new Date(poste.dateDebut));
  if (tempsMilliSeconde > 3.154e+10)
    return new Date(tempsMilliSeconde).getMonth() + " Mois et " + new Date(tempsMilliSeconde).getFullYear() + " Années";
  else if (2.628e+9)
    return new Date(tempsMilliSeconde).getMonth() + " Mois";
  else if (tempsMilliSeconde > 0)
    return new Date(tempsMilliSeconde).getDay() + " Jours";
  else
    return "Aucune ancienneté.";

}

/**
 * 
 * @param {*} array Tableau où les doublons sont à supprimer
 * @param {*} key Nom du parametre du tableau à garder unique
 * @returns Tableau sans doublon
 */
export function getUnique(array, key) {
  if (typeof key !== 'function') {
    const property = key;
    key = function (item) { return item[property]; };
  }
  return Array.from(array.reduce(function (map, item) {
    const k = key(item);
    if (!map.has(k)) map.set(k, item);
    return map;
  }, new Map()).values());
}

export function checkNumberAndDecimalIs0Or5(number) {
  // REGEX : https://regexr.com/3a36v
  const regex = /^\d{1,10}$|(?=^.{1,9}$)^\d+\.[05]\d{0,0}$/;

  if (regex.test(number)) {
    return true;
  }
  else {
    return false;
  }
}

/**
 * 
 * @param {*} salarieConges liste des congés du salarié 
 * @returns liste des période non travaillé : [{start: new Date("2022/10/24"), end: new Date("2022/10/28") },{start: new Date("2022/11/14"), end: new Date("2022/11/18") }]
 */
export function periodeCongeSalarie(salarieConges) {
  if (salarieConges.length > 0) {
    let conges = [];
    let myPastDate;
    salarieConges.forEach((conge, index) => {
      myPastDate = new Date(conge.dateDebut);
      myPastDate.setDate(myPastDate.getDate() - 1);
      conges[index] = { start: myPastDate, end: new Date(conge.dateFin) }
    });
    return conges;
  } else {
    return null;
  }
  //return [{start: new Date("2022/10/24"), end: new Date("2022/10/28") },{start: new Date("2022/11/14"), end: new Date("2022/11/18") }];
}

/**
 * 
 * @param {*} dateDebutConge Date du début du congé pour avoir l'année
 * @param {*} visitesmedicales Visites médicales du salarié
 * @returns liste des jour férié en France année n et n+3 et date visites médicales : [new Date("2022/10/24"), new Date("2022/10/28")]
 */
export function dateFerieOuVisisteMedicale(dateDebutConge, visitesmedicales) {
  //console.log("dateDebutConge : ", dateDebutConge);
  const pasTravail = [];
  let i = 0;
  let jours = null;
  const annee = parseInt(dateDebutConge ? moment(dateDebutConge).format("yyyy") : new Date().getFullYear());
  for (let index = 0; index < 3; index++) {
    jours = joursFeries(annee + index);
    Object.keys(jours).forEach(function (key) {
      pasTravail[i] = jours[key]
      i++;
    });
  }
  if (visitesmedicales) {
    visitesmedicales.forEach((vm) => {
      pasTravail[i] = new Date(vm.dateVisite);
      i++;
    });
  }
  return pasTravail;
}

/**
 * 
 * @param {*} dateDebut 
 * @param {*} dateFin 
 * @param {*} duree 
 * @returns Nombre de jour de la période sans les fériés
 */
export function substracHolydayInDuree(dateDebut, dateFin, duree) {
  let jours = null;
  let addYear = 0;
  const startDate = moment(dateDebut);
  const timeEnd = moment(dateFin);
  const diff = timeEnd.diff(startDate);
  const diffDuration = moment.duration(diff);
  const anneeDiff = diffDuration.years();

  if (anneeDiff > 0) {
    for (let index = 0; index < anneeDiff; index++) {
      jours = joursFeries(dateDebut.getFullYear() + addYear);
      Object.keys(jours).forEach(function (key) {
        if ((jours[key].getTime() <= dateFin.getTime() && jours[key].getTime() >= dateDebut.getTime())) {
          duree = duree - 1;
        }
      });
      addYear = 1;
    }
  } else {
    //jour ferie pour 1 an
    jours = joursFeries(dateDebut.getFullYear());
    Object.keys(jours).forEach(function (key, index) {
      if ((jours[key].getTime() <= dateFin.getTime() && jours[key].getTime() >= dateDebut.getTime())) {
        duree = duree - 1;
      }
    });
  }
  return duree;
}

export function substracWEInDuree(dateDebut, dateFin, duree) {
  /*for (var i = dateDebut; i <= dateFin; i.setDate(i.getDate()+1)){
     if (i.getDay() == 0 || i.getDay() == 1)
       duree = duree - 2;
  }*/
  var result = [];
  var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  var day = days["sunday".toLowerCase().substring(0, 3)];
  // Copy start date
  var current = new Date(dateDebut);
  // Shift to next of required days
  current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
  // While less than end date, add dates to result array
  while (current < dateFin) {
    result.push(new Date(+current));
    current.setDate(current.getDate() + 7);
  }

  return duree - (result.length * 2);
}
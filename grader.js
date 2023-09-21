const creditsMap = new Map(
  Object.entries({
    "INF-B-110": 15, // Einführung in die Mathematik für Informatiker
    "INF-B-120": 15, // Mathematische Methoden für Informatiker
    "INF-B-210": 6, // Algorithmen und Datenstrukturen
    "INF-B-230": 4, // Einführungspraktikum RoboLab
    "INF-B-240": 6, // Programmierung
    "INF-B-260": 5, // Informations- und Kodierungstheorie
    "INF-B-270": 8, // Formale Systeme
    "INF-B-290": 9, // Theoretische Informatik und Logik
    "INF-B-310": 6, // Softwaretechnologie
    "INF-B-320": 6, // Softwaretechnologie-Projekt
    "INF-B-330": 10, // Rechnerarchitektur
    "INF-B-370": 10, // Datenbanken und Rechnernetze
    "INF-B-380": 7, // Betriebssysteme und Sicherheit
    "INF-B-390": 10, // Technische Grundlagen und Hardwarepraktikum
    "INF-B-3A0": 6, // Systemorientierte Informatik/Hardware Software Codesign
    "INF-B-3B0": 5, // Intelligente Systeme
    "INF-B-410": 5, // Einführung in die Medieninformatik
    "INF-B-420": 5, // Einführung in die Computergraphik
    "INF-B-440": 4, // Grundlagen der Gestaltung
    "INF-B-450": 4, // Einführung in die Mediengestaltung
    "INF-B-460": 5, // Medien und Medienströme
    "INF-B-470": 3, // Medienpsychologie und -didaktik
    "INF-B-480": 5, // Web- und Multimedia Engineering
    "INF-B-490": 9, // Medieninformatik-Projekt
    /*"INF-B-510": 12, // Vertiefung in der Informatik
    "INF-B-520": 12, // Spezialisierung in der Informatik
    "INF-B-610": 5, // Überfachliche Qualifikationen zur Informatik
    "Bachelor-Arbeit": 52,*/
  })
);

const parseModule = (mod) => {
  let titleElement = mod.children[0].children[0].querySelector(
    "div:nth-child(1) > div:nth-child(1) > span:nth-child(2)"
  );
  let markElement = mod.children[0].querySelector(
    "div.cell:nth-child(2) > div.mark-wrapper:nth-child(1) > span.mark:nth-child(2)"
  );

  if (markElement == null || titleElement == null) {
    return null;
  }

  let grade = parseFloat(markElement.innerText);

  if (grade == 5.0) {
    return null; // unfinished/failed modules do not count into the calculation
  }

  let title = titleElement.innerText;
  let creditsIterator = creditsMap.entries();

  while ((entry = creditsIterator.next()) !== undefined) {
    if (title.includes(entry.value[0])) {
      return {
        module: entry.value[0],
        credit: entry.value[1],
        grade: grade,
      };
    }
  }

  return null;
};

const aggregateCourses = () => {
  const csModulesContainers = document.getElementsByClassName("module");

  if (csModulesContainers.length == 0) {
    console.log("Module Containers not found");
    return [];
  }

  let jExamModules = [];

  for (const container of csModulesContainers) {
    jExamModules = jExamModules.concat(Array.from(container.children).slice(1)); // skip the first, since its not a module
  }

  return jExamModules
    .map((module) => parseModule(module))
    .filter((module) => module != null);
};

(() => {
  const courses = aggregateCourses();

  if (courses.length == 0) {
    console.error("jExam Grader: No Courses found!");
    return;
  }

  console.log(courses);

  browser.storage.local.set({ courses }).then(() => {
    console.info("jExam Grader: updated courses");
  });

  /*const title = document.getElementsByClassName("button-heading").item(0)
    .children[0];
  title.innerText += ": " + finalGrade; */
})();

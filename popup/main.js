let courses;

this.onload = () => {
  browser.storage.local.get().then((item) => {
    console.log(item);
    document.getElementById("INF510").value = item.inf510 ?? "";
    document.getElementById("INF520").value = item.inf520 ?? "";
    document.getElementById("INF610").value = item.inf610 ?? "";
    document.getElementById("BACH").value = item.bach ?? "";

    courses = item.courses ?? [];
    recalculate();
  });

  document.addEventListener("keyup", recalculate);
};

const recalculate = () => {
  if (courses == []) {
    return;
  }
  
  const inf510 = document.getElementById("INF510").value;
  const inf520 = document.getElementById("INF520").value;
  const inf610 = document.getElementById("INF610").value;
  const bach = document.getElementById("BACH").value;
  browser.storage.local.set({ inf510, inf520, inf610, bach }).then(() => {
    console.log("update");
  });

  const combinedCourses = courses
    .concat([
      { credit: 12, grade: parseFloat(inf510) },
      { credit: 12, grade: parseFloat(inf520) },
      { credit: 5, grade: parseFloat(inf610) },
      { credit: 52, grade: parseFloat(bach) },
    ])
    .filter((course) => !isNaN(course.grade));

  console.log(combinedCourses);

  const weighedSum = combinedCourses.reduce(
    (sum, course) => sum + course.credit * course.grade,
    0
  );

  const credits = combinedCourses.reduce((sum, course) => sum + course.credit, 0);

  console.log(weighedSum);
  console.log(credits);

  const finalGrade = Math.round((100 * weighedSum) / credits) / 100;

  document.getElementById("grade").innerText = finalGrade;
  document.getElementById("grade").classList.remove("red");
};

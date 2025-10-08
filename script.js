let studentsData = [];
let venuesData = [];

// Load CSV files
Papa.parse("Students.csv", {
  download: true,
  header: true,
  complete: function(results) {
    studentsData = results.data;
  }
});

Papa.parse("Venues.csv", {
  download: true,
  header: true,
  complete: function(results) {
    venuesData = results.data;
  }
});

function searchStudent() {
  const rollNo = document.getElementById("rollNo").value.trim();
  
  // Case-insensitive search - convert both to uppercase
  const student = studentsData.find(s => 
    s["Roll No"].toUpperCase() === rollNo.toUpperCase()
  );

  const detailsDiv = document.getElementById("studentDetails");
  const scheduleDiv = document.getElementById("examSchedule");

  detailsDiv.innerHTML = "";
  scheduleDiv.innerHTML = "";

  if (!student) {
    detailsDiv.innerHTML = `<p style="color:red;">No student found with Roll No: ${rollNo}</p>`;
    return;
  }

  // Student details
  detailsDiv.innerHTML = `
    <h2>Student Details</h2>
    <p><strong>Name:</strong> ${student["Student Name"]}</p>
    <p><strong>Email:</strong> ${student["Email"]}</p>
  `;

  // Exam schedule - case-insensitive filter
  let courses = studentsData.filter(s => 
    s["Roll No"].toUpperCase() === rollNo.toUpperCase()
  );

  let tableHTML = `
    <h2>Exam Schedule</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Venue</th>
            <th>Rooms</th>
          </tr>
        </thead>
        <tbody>
  `;

  courses.forEach(c => {
    let venueRow = venuesData.filter(v => v["Course Code"] === c["Course Code"]);
    let venue = venueRow.length > 0 ? venueRow[0]["Venue"] : "Not Assigned";
    let rooms = venueRow.length > 0 ? [...new Set(venueRow.map(v => v["Room"]))].join(", ") : "-";

    tableHTML += `
      <tr>
        <td>${c["Date"]}</td>
        <td>${c["Time"]}</td>
        <td>${c["Course Code"]}</td>
        <td>${c["Course Name"]}</td>
        <td>${c["Instructor 1"]}</td>
        <td>${venue}</td>
        <td>${rooms}</td>
      </tr>
    `;
  });

  tableHTML += "</tbody></table></div>";
  scheduleDiv.innerHTML = tableHTML;
}

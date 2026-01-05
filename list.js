async function loadPeople() {
  try {
    const res = await fetch("people.csv");
    const csvText = await res.text();

    const people = parseCSV(csvText);

    // Sort by credential ascending (numeric sort)
    people.sort((a, b) => Number(a.credential) - Number(b.credential));

    

    const tbody = document.getElementById("peopleTableBody");
    tbody.innerHTML = "";

    people.forEach((p) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${p.credential}</td>
        <td>${p.name}</td>
        <td>
          <a class="icon-btn" 
             href="certificate.html?credential=${encodeURIComponent(p.credential)}"
             title="Open Certificate" target="_blank" rel="noopener">
            📋
          </a>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    document.getElementById("count").textContent = "";
    document.getElementById("peopleTableBody").innerHTML =
      `<tr><td colspan="3" class="error">Failed to load people.csv</td></tr>`;
    console.error(err);
  }
}


function parseCSV(csvText) {
  // Remove UTF-8 BOM if exists
  csvText = csvText.replace(/^\uFEFF/, "");

  // Normalize line endings (\r\n -> \n)
  csvText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const lines = csvText.trim().split("\n");

  // Clean headers (trim + remove invisible chars)
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^\uFEFF/, ""));

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(",").map((v) => v.trim());
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] ?? "";
    });

    data.push(obj);
  }

  return data;
}

loadPeople();

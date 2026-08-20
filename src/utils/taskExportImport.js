// Task Backup & Restore Helpers

export function exportTasksToJSON(tasks) {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `focus_tasks_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (error) {
    console.error("Export error:", error);
    return false;
  }
}

export function importTasksFromJSON(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) {
        callback(imported);
      } else {
        alert("Invalid file format. Please upload a valid JSON backup file.");
      }
    } catch (e) {
      alert("Failed to parse JSON file.");
    }
  };
  reader.readAsText(file);
}

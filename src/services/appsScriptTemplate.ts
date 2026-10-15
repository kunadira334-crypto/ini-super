export const KBC_APPS_SCRIPT_CODE_GS = `/**
 * ==============================================================================
 * SISTEM INFORMASI SUPERVISI MADRASAH ALIYAH MAMBAUL ULUM
 * Desa Sumberduren, Kecamatan Krucil, Kabupaten Probolinggo
 * KURIKULUM BERBASIS CINTA (KBC) & PEMBELAJARAN MENDALAM (DEEP LEARNING)
 * ==============================================================================
 * Database Google Spreadsheet dengan Sheet Resmi:
 * 1. Master_Guru       : Columns (id, nama, mapel)
 * 2. Master_Tendik     : Columns (id, nama, bidang_tugas)
 * 3. Supervisi_Guru    : Columns (id, id_guru, tanggal, skor_tujuan, skor_indikator, skor_materi, skor_aktivitas, catatan_total, total_skor, kategori)
 * 4. Supervisi_Tendik  : Columns (id, id_tendik, tanggal, bidang_tugas, skor_1_sd_8, catatan_total, total_skor, kategori)
 * 5. Tindak_Lanjut     : Columns (id, aspek, temuan, rencana, waktu, status)
 * 6. Jadwal_Supervisi  : Columns (id, tipe, personil_id, nama, nip, tugas, tanggal, hari, jam_mulai, jam_selesai, kelas_ruang, fokus_supervisi, supervisor_nama, status, keterangan)
 * ==============================================================================
 */

var TAB_NAMES = {
  GURU: 'Master_Guru',
  TENDIK: 'Master_Tendik',
  SUPERVISI_GURU: 'Supervisi_Guru',
  SUPERVISI_TENDIK: 'Supervisi_Tendik',
  TINDAK_LANJUT: 'Tindak_Lanjut',
  JADWAL: 'Jadwal_Supervisi'
};

/**
 * Inisialisasi Otomatis 5 Sheet Sesuai Spesifikasi Database
 * Jalankan fungsi ini sekali di editor Apps Script!
 */
function setupMadrasahSpreadsheetDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Master_Guru (id, nama, mapel)
  var sheetGuru = getOrCreateSheet(ss, TAB_NAMES.GURU);
  if (sheetGuru.getLastRow() === 0) {
    formatHeaderRow(sheetGuru, ['id', 'nama', 'mapel'], '#065f46');
    sheetGuru.appendRow(['GUR-01', "Ustadz Ahmad Farhan, S.Pd.I.", "Al-Qur'an Hadits"]);
    sheetGuru.appendRow(['GUR-02', 'Siti Nurul Hidayah, S.Pd., M.Pd.', 'Bahasa Indonesia']);
    sheetGuru.appendRow(['GUR-03', 'M. Wildan Al-Ghozali, S.Pd.', 'Matematika Peminatan']);
    sheetGuru.appendRow(['GUR-04', 'Dewi Masruroh, M.Pd.', 'Biologi']);
    sheetGuru.appendRow(['GUR-05', 'K.H. Lukman Hakim, Lc., M.Hum.', 'Bahasa Arab']);
  }

  // 2. Master_Tendik (id, nama, bidang_tugas)
  var sheetTendik = getOrCreateSheet(ss, TAB_NAMES.TENDIK);
  if (sheetTendik.getLastRow() === 0) {
    formatHeaderRow(sheetTendik, ['id', 'nama', 'bidang_tugas'], '#047857');
    sheetTendik.appendRow(['TND-01', 'H. Abdul Rasyid, S.Sos.', 'Kepegawaian']);
    sheetTendik.appendRow(['TND-02', 'Bambang Sugiyanto, S.AP.', 'Sarana Prasarana']);
    sheetTendik.appendRow(['TND-03', 'Lailatul Fitriyah, A.Md.', 'Persuratan']);
    sheetTendik.appendRow(['TND-04', 'Syahrul Ramadhan, S.Kom.', 'Kesiswaan']);
  }

  // 3. Supervisi_Guru
  // Columns: id, id_guru, tanggal, skor_tujuan, skor_indikator, skor_materi, skor_aktivitas, catatan_total, total_skor, kategori
  var sheetSupGuru = getOrCreateSheet(ss, TAB_NAMES.SUPERVISI_GURU);
  if (sheetSupGuru.getLastRow() === 0) {
    var headersSupGuru = [
      'id', 'id_guru', 'tanggal', 'skor_tujuan', 'skor_indikator', 
      'skor_materi', 'skor_aktivitas', 'catatan_total', 'total_skor', 'kategori'
    ];
    formatHeaderRow(sheetSupGuru, headersSupGuru, '#14532d');
  }

  // 4. Supervisi_Tendik
  // Columns: id, id_tendik, tanggal, bidang_tugas, skor_1_sd_8, catatan_total, total_skor, kategori
  var sheetSupTendik = getOrCreateSheet(ss, TAB_NAMES.SUPERVISI_TENDIK);
  if (sheetSupTendik.getLastRow() === 0) {
    var headersSupTendik = [
      'id', 'id_tendik', 'tanggal', 'bidang_tugas', 
      'skor_1_sd_8', 'catatan_total', 'total_skor', 'kategori'
    ];
    formatHeaderRow(sheetSupTendik, headersSupTendik, '#0f766e');
  }

  // 5. Tindak_Lanjut
  // Columns: id, aspek, temuan, rencana, waktu, status
  var sheetTL = getOrCreateSheet(ss, TAB_NAMES.TINDAK_LANJUT);
  if (sheetTL.getLastRow() === 0) {
    var headersTL = ['id', 'aspek', 'temuan', 'rencana', 'waktu', 'status'];
    formatHeaderRow(sheetTL, headersTL, '#854d0e');
  }

  // 6. Jadwal_Supervisi
  // Columns: id, tipe, personil_id, nama, nip, tugas, tanggal, hari, jam_mulai, jam_selesai, kelas_ruang, fokus_supervisi, supervisor_nama, status, keterangan
  var sheetJadwal = getOrCreateSheet(ss, TAB_NAMES.JADWAL);
  if (sheetJadwal.getLastRow() === 0) {
    var headersJadwal = [
      'id', 'tipe', 'personil_id', 'nama', 'nip', 'tugas', 
      'tanggal', 'hari', 'jam_mulai', 'jam_selesai', 'kelas_ruang', 
      'fokus_supervisi', 'supervisor_nama', 'status', 'keterangan'
    ];
    formatHeaderRow(sheetJadwal, headersJadwal, '#1e3a8a');
  }

  return 'Setup Database Sheet Madrasah Aliyah Mambaul Ulum Berhasil Selesai!';
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function formatHeaderRow(sheet, headers, bgColor) {
  sheet.appendRow(headers);
  var range = sheet.getRange(1, 1, 1, headers.length);
  range.setBackground(bgColor);
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
  range.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * GET Handler - Ambil data dari 5 sheet
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = e && e.parameter ? e.parameter.action : 'getAll';

    if (action === 'ping') {
      return jsonOutput({
        success: true,
        message: 'Koneksi ke Database MA Mambaul Ulum Aktif!',
        spreadsheetName: ss.getName(),
        spreadsheetId: ss.getId(),
        timestamp: new Date().toISOString()
      });
    }

    var result = {
      Master_Guru: readSheetData(ss.getSheetByName(TAB_NAMES.GURU)),
      Master_Tendik: readSheetData(ss.getSheetByName(TAB_NAMES.TENDIK)),
      Supervisi_Guru: readSheetData(ss.getSheetByName(TAB_NAMES.SUPERVISI_GURU)),
      Supervisi_Tendik: readSheetData(ss.getSheetByName(TAB_NAMES.SUPERVISI_TENDIK)),
      Tindak_Lanjut: readSheetData(ss.getSheetByName(TAB_NAMES.TINDAK_LANJUT))
    };

    return jsonOutput({ success: true, data: result });
  } catch (err) {
    return jsonOutput({ success: false, error: err.toString() });
  }
}

/**
 * POST Handler - Simpan sinkronisasi massal atau baris baru
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var raw = e.postData ? e.postData.contents : '';
    var payload = raw ? JSON.parse(raw) : {};

    if (payload.action === 'syncAllKBC') {
      if (payload.Master_Guru) writeFullSheet(ss.getSheetByName(TAB_NAMES.GURU), payload.Master_Guru);
      if (payload.Master_Tendik) writeFullSheet(ss.getSheetByName(TAB_NAMES.TENDIK), payload.Master_Tendik);
      if (payload.Supervisi_Guru) writeFullSheet(ss.getSheetByName(TAB_NAMES.SUPERVISI_GURU), payload.Supervisi_Guru);
      if (payload.Supervisi_Tendik) writeFullSheet(ss.getSheetByName(TAB_NAMES.SUPERVISI_TENDIK), payload.Supervisi_Tendik);
      if (payload.Tindak_Lanjut) writeFullSheet(ss.getSheetByName(TAB_NAMES.TINDAK_LANJUT), payload.Tindak_Lanjut);

      return jsonOutput({
        success: true,
        message: 'Seluruh 5 sheet berhasil disinkronkan ke Google Spreadsheet!',
        timestamp: new Date().toISOString()
      });
    }

    return jsonOutput({ success: false, error: 'Aksi tidak dikenali' });
  } catch (err) {
    return jsonOutput({ success: false, error: err.toString() });
  }
}

function readSheetData(sheet) {
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = [];
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var key = headers[c];
      var val = row[c];
      if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
        try { val = JSON.parse(val); } catch(e) {}
      }
      obj[key] = val;
    }
    rows.push(obj);
  }
  return rows;
}

function writeFullSheet(sheet, items) {
  if (!sheet || !items) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  var rows = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var row = [];
    for (var c = 0; c < headers.length; c++) {
      var key = headers[c];
      var val = item[key] !== undefined ? item[key] : '';
      if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
        val = JSON.stringify(val);
      }
      row.push(val);
    }
    rows.push(row);
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const APPS_SCRIPT_CODE_GS = KBC_APPS_SCRIPT_CODE_GS;

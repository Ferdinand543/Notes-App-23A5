<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const API = 'http://localhost:5000/api/notes'

const notes = ref([])
const title = ref('')
const content = ref('')
const search = ref('')
const editingId = ref(null)

const getNotes = async () => {
  try {
    const res = await axios.get(API)
    notes.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const addNote = async () => {

  if (!title.value || !content.value) {
    alert('Judul dan catatan wajib diisi!')
    return
  }

  try {

    await axios.post(API, {
      title: title.value,
      content: content.value
    })

    title.value = ''
    content.value = ''

    getNotes()

  } catch (error) {
    console.log(error)
  }
}

const editNote = (note) => {

  title.value = note.title
  content.value = note.content

  editingId.value = note.id
}

const updateNote = async () => {

  try {

    await axios.put(`${API}/${editingId.value}`, {
      title: title.value,
      content: content.value
    })

    title.value = ''
    content.value = ''

    editingId.value = null

    getNotes()

  } catch (error) {
    console.log(error)
  }
}

const cancelEdit = () => {

  title.value = ''
  content.value = ''

  editingId.value = null
}

const deleteNote = async (id) => {

  const confirmDelete = confirm('Yakin ingin menghapus note ini?')

  if (confirmDelete) {

    try {

      await axios.delete(`${API}/${id}`)

      getNotes()

    } catch (error) {
      console.log(error)
    }

  }

}

const filteredNotes = computed(() => {

  return notes.value.filter((note) =>
    note.title.toLowerCase().includes(search.value.toLowerCase())
  )

})

onMounted(() => {
  getNotes()
})
</script>

<template>
  <div class="app">

    <div class="overlay"></div>

    <div class="container">

      <!-- HEADER -->
      <header class="header">

        <div>
          <h1>📝 Notes Apps SI-A</h1>
          <p>Kelola catatanmu dengan mudah dan modern</p>
        </div>

        <div class="total-notes">
          <span>Total Notes</span>
          <h2>{{ notes.length }}</h2>
        </div>

      </header>

      <div class="content">

        <!-- LEFT -->
        <div class="left-card">

          <h2>
            {{ editingId ? 'Edit Catatan' : 'Tambah Catatan' }}
          </h2>

          <div class="form-group">

            <label>Judul</label>

            <input
              v-model="title"
              type="text"
              placeholder="Masukkan judul..."
            />

          </div>

          <div class="form-group">

            <label>Catatan</label>

            <textarea
              v-model="content"
              placeholder="Tulis catatanmu..."
            ></textarea>

          </div>

          <button
            class="btn-add"
            @click="editingId ? updateNote() : addNote()"
          >
            {{ editingId ? 'Update Note' : '+ Tambah Note' }}
          </button>

          <button
            v-if="editingId"
            class="btn-cancel"
            @click="cancelEdit"
          >
            Cancel
          </button>

        </div>

        <!-- RIGHT -->
        <div class="right-card">

          <div class="top-bar">

            <h2>Daftar Notes</h2>

            <input
              class="search"
              v-model="search"
              placeholder="Cari note..."
            />

          </div>

          <div
            v-if="filteredNotes.length === 0"
            class="empty"
          >
            Tidak ada catatan
          </div>

          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="note-card"
          >

            <div class="note-content">

              <h3>{{ note.title }}</h3>

              <p>{{ note.content }}</p>

            </div>

            <div class="action-buttons">

              <button
                class="btn-edit"
                @click="editNote(note)"
              >
                Edit
              </button>

              <button
                class="btn-delete"
                @click="deleteNote(note.id)"
              >
                Hapus
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
  padding: 40px 20px;
}

.overlay {
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  filter: blur(50px);
}

.container {
  max-width: 1200px;
  margin: auto;
  position: relative;
  z-index: 10;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: white;
}

.header h1 {
  font-size: 40px;
  margin-bottom: 8px;
}

.header p {
  opacity: 0.9;
}

.total-notes {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  min-width: 150px;
}

.total-notes h2 {
  font-size: 36px;
  margin-top: 8px;
}

.content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 25px;
}

.left-card,
.right-card {
  background: white;
  border-radius: 22px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.left-card h2,
.right-card h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

input,
textarea {
  width: 100%;
  padding: 14px;
  border: 2px solid #eee;
  border-radius: 12px;
  outline: none;
  transition: 0.3s;
  font-size: 14px;
}

input:focus,
textarea:focus {
  border-color: #667eea;
}

textarea {
  min-height: 140px;
  resize: none;
}

.btn-add {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.btn-add:hover {
  transform: translateY(-2px);
}

.btn-cancel {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: #999;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 12px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
}

.search {
  max-width: 250px;
}

.note-card {
  background: #f7f8ff;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: 0.3s;
  border: 1px solid #ececff;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.note-content {
  max-width: 70%;
}

.note-content h3 {
  color: #333;
  margin-bottom: 10px;
}

.note-content p {
  color: #666;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-edit {
  background: #667eea;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-edit:hover {
  background: #5865d8;
}

.btn-delete {
  background: #ff4d6d;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-delete:hover {
  background: #e63956;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #777;
}

@media(max-width: 900px) {

  .content {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search {
    max-width: 100%;
  }

  .note-card {
    flex-direction: column;
    gap: 20px;
  }

  .note-content {
    max-width: 100%;
  }

}

</style>
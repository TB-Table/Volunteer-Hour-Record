<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const searchQuery = ref("")
const sortOrder = ref("newest")
const records = ref([]) 
const loading = ref(false) //加载中
const errorMessage = ref("") //报错
let currentRequestId = 0 //第几次请求//
const dialogRef = ref(null)
const editingRecordId = ref(null)

const formData = ref({
  organization: '',
  activity: '',
  hours: '',
  date: '',
  text: ''
})

//前后端连接
async function fetchRecord(){
  const requestId = ++currentRequestId
  loading.value = true
  errorMessage.value = ""

  try{
    const params = new URLSearchParams()
    params.set('search', searchQuery.value.trim())
  
    const response = await fetch(
      `http://localhost:8989/api/records?${params.toString()}`
    )

    const data = await response.json()
    if (requestId === currentRequestId) {
      records.value = data
    }
  } catch (error) {
    if (requestId === currentRequestId) {
      errorMessage.value = error.message
    }
  } finally {
    if (requestId === currentRequestId) {
      loading.value = false
    }
  }
}

onMounted(fetchRecord) //打开网页获取一次数据
watch(searchQuery, fetchRecord) //搜索变化获取数据


/* 前端检索，但现在用后端了, 留着养眼
const filteredRecords = computed(() => {
const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword){
    return records.value
  }

  const result = records.value.filter(record => {
    return record.activity.toLowerCase().includes(keyword) ||
           record.organization.toLowerCase().includes(keyword) ||
           record.text.toLowerCase().includes(keyword)
  });
  result.sort((a, b) => {
    if (sortOrder.value === 'newest') {
      return new Date(b.date) - new Date(a.date)
    }

    if (sortOrder.value === 'oldest') {
      return new Date(a.date) - new Date(b.date)
    } 

    return 0
  })

  return result
})
  */

  //改变排序传给前端显示
    const sortedRecords = computed(() => {
    const result = [...records.value]
    result.sort((a, b) => {
      if (sortOrder.value === 'newest') {
        return new Date(b.date) - new Date(a.date)
      }

      if (sortOrder.value === 'oldest') {
        return new Date(a.date) - new Date(b.date)
      }

      return 0
    })

    return result
  })

function editRecord(record) {
  editingRecordId.value = record.id

  formData.value = {
    organization: record.organization,
    activity: record.activity,
    hours: record.hours,
    date: Array.isArray(record.date)
      ? record.date[0]
      : record.date,
    text: record.text
  }

  dialogRef.value.showModal()
}

// 关闭弹窗
function hideDialog() {
  dialogRef.value.close()
  editingRecordId.value = null
}

// 保存修改
async function updateRecord() {
  try {
    const response = await fetch(
      `http://localhost:8989/api/records/${editingRecordId.value}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData.value,
          date: [formData.value.date]
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update record')
    }

    hideDialog()
    await fetchRecord()

  } catch (error) {
    console.error('修改记录失败:', error)
  }
}

</script>

<template>
  <section class="records-page">
   <div class="toolbar">
  <input
    v-model="searchQuery"
    type="search"
    placeholder="Search activities..."
  />

  <select v-model="sortOrder">
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
  </select>
</div>

      <table>
        <thead>
          <tr>
              <td>Date</td>
              <td>Activity</td>
              <td>Organization</td>
              <td>Hours</td>
              <td>Actions</td>
          </tr>
        </thead>
        <tbody>
        <tr v-for="record in sortedRecords" :key="record.id" >
          <td>{{ record.date[0] }}</td>
          <td>{{ record.activity }}</td>
          <td>{{ record.organization }}</td>
          <td>{{ Number(record.hours ?? 0).toFixed(1) }}</td>
          <td>
            <button class="edit-button" 
              @click="editRecord(record)">
              Edit
            </button>
          </td>
        </tr>
        
        <tr v-if="records && records.length === 0">
          <td colspan="4">No matching records found.</td>
        </tr>
      </tbody>
    </table>

    <dialog ref="dialogRef" class="edit-dialog">
      <h2>Edit Record</h2>

      <form @submit.prevent="updateRecord">

        <label>Organization</label>
        <input v-model="formData.organization" required />

        <label>Activity</label>
        <input v-model="formData.activity" required />

        <label>Hours</label>
        <input
          v-model.number="formData.hours"
          type="number"
          min="0"
          step="0.1"
          required
        />

        <label>Date</label>
        <input v-model="formData.date" type="date" required />

        <label>Description</label>
        <textarea v-model="formData.text"></textarea>

        <div class="dialog-actions">
          <button type="button" @click="hideDialog">
            Cancel
          </button>

          <button type="submit">
            Save Changes
          </button>
        </div>

      </form>
    </dialog>

  </section>
</template>

<style scoped>
.records-page {
  width: 100%;
  min-height: calc(100vh - 104px);
  box-sizing: border-box;
  padding: 48px 8%;
  background: #f6f7f9;
  color: #344054;
  font-family: inherit;
}



.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.toolbar input {
  flex: 1;
  min-width: 0;
  height: 48px;
  box-sizing: border-box;
  padding: 0 18px;
  border: 1px solid #e4e7ec;
  border-radius: 9px;
  background: #fff;
  color: #344054;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.toolbar input::placeholder {
  color: #98a2b3;
}

.toolbar input:focus {
  border-color: #ed8b0c;
  box-shadow: 0 0 0 3px rgba(237, 139, 12, 0.10);
}

.toolbar select {
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e4e7ec;
  border-radius: 9px;
  background: white;
  color: #344054;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.toolbar select:focus {
  border-color: #ed8b0c;
}



.records-page table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e9ebef;
  border-radius: 12px;
  background: white;
  overflow: hidden;
}

/* Header */
.records-page thead {
  background: #fafafa;
}

.records-page thead td {
  padding: 18px 24px;
  border-bottom: 1px solid #eaecf0;
  color: #667085;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

/* Body */
.records-page tbody td {
  padding: 19px 24px;
  border-bottom: 1px solid #f0f1f3;
  color: #475467;
  font-size: 14px;
  vertical-align: middle;
}

.records-page tbody tr:last-child td {
  border-bottom: none;
}

.records-page tbody tr {
  transition: background 0.2s ease;
}

.records-page tbody tr:hover {
  background: #fffbf5;
}

/* Hours */
.records-page tbody td:nth-child(4) {
  color: #ed8b0c;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* Actions */
.records-page tbody td:last-child {
  width: 110px;
}

.edit-button {
  min-width: 62px;
  padding: 8px 14px;
  border: 1px solid #f2bd79;
  border-radius: 7px;
  background: #fffaf3;
  color: #d97900;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.edit-button:hover {
  border-color: #ed8b0c;
  background: #ed8b0c;
  color: white;
}

.edit-button:focus-visible {
  outline: 3px solid rgba(237, 139, 12, 0.2);
  outline-offset: 2px;
}

/* Empty State */
.records-page td[colspan] {
  padding: 38px;
  text-align: center;
  color: #98a2b3;
}



.edit-dialog {
  width: min(440px, calc(100% - 36px));
  box-sizing: border-box;
  padding: 30px;
  border: 1px solid #eaecf0;
  border-radius: 14px;
  background: white;
  color: #344054;
  box-shadow: 0 20px 60px rgba(16, 24, 40, 0.16);
}

.edit-dialog::backdrop {
  background: rgba(16, 24, 40, 0.42);
  backdrop-filter: blur(3px);
}

.edit-dialog h2 {
  margin: 0 0 24px;
  color: #202124;
  font-size: 22px;
}

.edit-dialog form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-dialog label {
  margin-top: 5px;
  color: #475467;
  font-size: 13px;
  font-weight: 600;
}

.edit-dialog input,
.edit-dialog textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border: 1px solid #dfe2e7;
  border-radius: 8px;
  background: white;
  color: #344054;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.edit-dialog input:focus,
.edit-dialog textarea:focus {
  border-color: #ed8b0c;
  box-shadow: 0 0 0 3px rgba(237, 139, 12, 0.1);
}

.edit-dialog textarea {
  min-height: 85px;
  resize: vertical;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.dialog-actions button {
  padding: 10px 17px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dialog-actions button[type="button"] {
  border: 1px solid #e4e7ec;
  background: white;
  color: #475467;
}

.dialog-actions button[type="button"]:hover {
  background: #f2f4f7;
}

.dialog-actions button[type="submit"] {
  border: 1px solid #ed8b0c;
  background: #ed8b0c;
  color: white;
}

.dialog-actions button[type="submit"]:hover {
  border-color: #d97900;
  background: #d97900;
}


.status-message {
  margin-bottom: 15px;
  color: #667085;
  font-size: 14px;
}

.error-message {
  margin-bottom: 15px;
  color: #d92d20;
  font-size: 14px;
}


@media (max-width: 900px) {
  .records-page {
    padding: 35px 5%;
  }

  .records-page thead td,
  .records-page tbody td {
    padding: 15px 14px;
  }
}

@media (max-width: 600px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar input,
  .toolbar select {
    width: 100%;
  }

  .records-page {
    padding: 25px 4%;
  }

  .records-page table {
    min-width: 650px;
  }

  .edit-dialog {
    padding: 22px;
  }
}


</style>
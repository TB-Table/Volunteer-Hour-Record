<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const searchQuery = ref("")
const sortOrder = ref("newest")
const records = ref([]) 
const loading = ref(false) //加载中
const errorMessage = ref("") //报错
let currentRequestId = 0 //第几次请求//

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


/* 前端检索，但现在用后端了
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
          </tr>
        </thead>
        <tbody>
        <tr v-for="record in records" :key="record.id">
          <td>{{ record.date }}</td>
          <td>{{ record.activity }}</td>
          <td>{{ record.organization }}</td>
         <td>{{ Number(record.hours ?? 0).toFixed(1) }}</td>
        </tr>
        
        <tr v-if="records && records.length === 0">
          <td colspan="4">No matching records found.</td>
        </tr>
      </tbody>
    </table>

  </section>
</template>

<style scoped>
.records-page {
  width: 100%;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.toolbar input {
  flex: 1;
  min-width: 0;
}

.toolbar select {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #344054;
  cursor: pointer;
}

@media (max-width: 600px) {
  .toolbar {
    flex-direction: column;
  }
}
</style>
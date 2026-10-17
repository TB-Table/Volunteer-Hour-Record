<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref("")

const records = ref([])

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
          <tr v-for="record in filteredRecords" :key="record.id">
              <td>{{ record.date }}</td>
              <td>{{ record.activity }}</td>
              <td>{{ record.organization }}</td>
              <td>{{ Number(record.hours ?? 0).toFixed(1) }}</td>
          </tr>
        </thead>
        <tbody>
        <tr v-for="record in filteredRecords" :key="record.id">
          <td>{{ record.date }}</td>
          <td>{{ record.activity }}</td>
          <td>{{ record.organization }}</td>
         <td>{{ Number(record.hours ?? 0).toFixed(1) }}</td>
        </tr>
        
        <tr v-if="filteredRecords && filteredRecords.length === 0">
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
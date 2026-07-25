# Adult Visitors Page — Enhancement Plan

## Overview
Add 4 features to `app/pages/adult/index.vue`: occupation field, auto-scroll on edit, column sorting, and CSV/Excel/PDF export.

---

## 1. Occupation Field

### Step 1.1 — DB Migration (run in Supabase SQL Editor)
```sql
ALTER TABLE adult_visitors ADD COLUMN occupation text;
```

### Step 1.2 — `database/adult_visitors.sql`
Insert `occupation text` after the `address` column (line 27).

### Step 1.3 — `app/types/database.ts`
Add `occupation: string | null` to `adult_visitors.Row`, `.Insert`, and `.Update`.

### Step 1.4 — `app/composables/useAdultVisitors.ts`
Add `occupation?: string | null` to the `AdultVisitor` interface.

### Step 1.5 — `server/api/adult-visitors/index.post.ts`
Add `occupation: body.occupation || null` to the insert payload (after `address`).

### Step 1.6 — `server/api/adult-visitors/public.post.ts`
Add `occupation: body.occupation || null` to the insert payload (after `address`).

### Step 1.7 — `server/api/adult-visitors/[id].patch.ts`
Add `'occupation'` to the `ALLOWED_FIELDS` array.

### Step 1.8 — `app/pages/adult/register.vue` (public form)
Add an "Occupation" input after Address/Location in the form.

### Step 1.9 — `app/pages/adult/index.vue` (admin page)
- `emptyForm()`: add `occupation: ''`
- `editVisitor()`: add `occupation: visitor.occupation || ''`
- Form: add an "Occupation" input between "Address" and "How they heard"
- Desktop table: add "Occupation" column after "Assigned" column

---

## 2. Auto-scroll on Edit

### Changes in `app/pages/adult/index.vue`

**Script:**
```ts
const editForm = ref<HTMLFormElement | null>(null)
const editingScrollTarget = ref<string | null>(null)
```

**`editVisitor()`** — after populating form + `showForm.value = true`:
```ts
nextTick(() => {
  editForm.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
})
```

**`cancelEdit()`** — before clearing state:
```ts
const target = editingScrollTarget.value
```

**`submitForm()` success path** — after updating/adding:
```ts
// scroll back to the row
const targetId = editingScrollTarget.value
editingScrollTarget.value = null
```

**Template:**
- `<form ref="editForm">`
- Desktop rows: `:id="'visitor-' + visitor.id"`
- Mobile cards: `:id="'visitor-' + visitor.id"`

---

## 3. Column Sorting (Name, Visit Date, Assigned, Status)

### Changes in `app/pages/adult/index.vue`

**New refs:**
```ts
const sortField = ref<string | null>(null) // 'name' | 'visit_date' | 'assigned_to' | 'follow_up_status' | null
const sortOrder = ref<'asc' | 'desc'>('asc')
```

**`sortedVisitors` computed:**
```ts
const sortedVisitors = computed(() => {
  if (!sortField.value) return visitors.value
  return [...visitors.value].sort((a, b) => {
    // compare by sortField
  })
})
```

**Table headers** — replace static `<th>` with clickable buttons:
- Guest (sorts by `'name'` — compare `first_name + last_name`)
- Visit (sorts by `'visit_date'`)
- Assigned (sorts by `'assigned_to'`)
- Status (sorts by `'follow_up_status'`)

**Click handler `toggleSort(field)`**:
- 1st click: `sortField = field`, `sortOrder = 'asc'`
- 2nd click: `sortOrder = 'desc'`
- 3rd click: `sortField = null` (revert to API order)

**Sort indicators** — show `▲` / `▼` on active column.

**Usage:** replace `v-for="visitor in visitors"` → `v-for="visitor in sortedVisitors"` in both table and mobile views.

---

## 4. CSV / Excel / PDF Export

### Changes in `app/pages/adult/index.vue`

### New refs
```ts
const showExportMenu = ref(false)
const exportingFormat = ref<string | null>(null)
```

### Export button + dropdown
Place after the status filter `<select>`:
```html
<div class="relative export-dropdown-container">
  <button @click="showExportMenu = !showExportMenu">Export ↓</button>
  <div v-if="showExportMenu">
    <button @click="exportToCSV">CSV</button>
    <button @click="exportToXLS">Excel (.xls)</button>
    <button @click="exportToPDF">PDF (Print)</button>
  </div>
</div>
```

### `exportToCSV()`
- Build CSV rows: Name, Email, Phone, Visit Date, Address, Occupation, How Heard, Interests, Assigned To, Status, Notes
- `Blob` → download as `adult_visitors_<timestamp>.csv`

### `exportToXLS()`
- Build HTML `<table>` string with same columns
- `Blob` → download as `adult_visitors_<timestamp>.xls`

### `exportToPDF()`
- Build HTML string with a styled table + title
- `window.open('', '_blank')` → write HTML → `window.print()`

### Click-outside handler
Same pattern as `attendance.vue`:
```ts
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
```

---

## Files Modified

| File | Changes |
|------|---------|
| `database/adult_visitors.sql` | Add `occupation` column |
| `app/types/database.ts` | Add `occupation` to Row/Insert/Update |
| `app/composables/useAdultVisitors.ts` | Add `occupation` to interface |
| `server/api/adult-visitors/index.post.ts` | Accept `occupation` in create |
| `server/api/adult-visitors/public.post.ts` | Accept `occupation` in public create |
| `server/api/adult-visitors/[id].patch.ts` | Allow `occupation` in patch |
| `app/pages/adult/index.vue` | Occupation field, scroll, sort, export |
| `app/pages/adult/register.vue` | Occupation field in public form |

---

## DB Migration (run manually)

```sql
ALTER TABLE adult_visitors ADD COLUMN occupation text;
```

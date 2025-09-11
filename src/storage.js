// src/storage.js
// Shared localStorage module for todo lists

const STORAGE_KEY = 'todoCollection';

export function saveToLocalStorage(collection) {
    try {
        const data = collection.stringify();
        localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
        console.error('Failed to save to localStorage', e);
        alert('Failed to save data. Your changes may be lost.');
    }
}

export function loadFromLocalStorage(TodoCollection) {
    const data = localStorage.getItem(STORAGE_KEY);
    const collection = new TodoCollection();
    if (data) {
        try {
            const obj = JSON.parse(data);
            if (!obj || !Array.isArray(obj.lists)) {
                throw new Error('Empty store or malformed data');
            }
            obj.lists.forEach(listData => {
                collection.addList(listData.listName);
                const list = collection.getList(collection.lists.length - 1);
                listData.items.forEach(itemData => {
                    list.addItem(itemData.desc);
                    list.setItemStatus(list.items.length - 1, itemData.status);
                });
            });
        } catch (e) {
            console.error('Failed to load from localStorage', e);
            collection.addList('SampleList');
            const list = collection.getList(0);
            list.addItem('Sample Task 1');
            list.addItem('Sample Task 2');
            list.setItemStatus(1, 'doing');
            saveToLocalStorage(collection);
        }
    }
    return collection;
}

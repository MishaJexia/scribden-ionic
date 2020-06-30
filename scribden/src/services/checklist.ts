import { ChecklistItemType, ChecklistType } from '../interfaces/checklist';
import { store } from './store';

class ChecklistServiceController {
  fetchChecklist(itemId: string): void {
    console.log('FETCH CHECKLIST');
    store.db.dataset('Checklists')
      .select()
      .where(field => field('itemId').isEqualTo(itemId))
      .related('ChecklistItems', checklistItems => checklistItems.fields('checklistId', 'name'))
      .subscribe((records) => {
        console.log(records);
        const behaviors = store.getBehaviors(itemId);
        behaviors.checklist = records[0];
        store.setBehaviors(itemId, behaviors);

        store.db.dataset('ChecklistItems')
          .select()
          .where(field => field('checklistId').isEqualTo(behaviors.checklist.id))
          .subscribe((records) => {
            console.log(records);
          })
      },
        (error) => console.error(error)
      );
  }

  createList(itemId: string): void {
    store.db.dataset('Checklists')
      .insert({ itemId })
      .subscribe(() => {
        const behaviors = store.getBehaviors(itemId);
        behaviors.checklist = [];
        store.setBehaviors(itemId, behaviors);
      },
        (error) => console.error(error)
      );
  }

  getList(itemId: string): ChecklistType {
    const behaviors = store.getBehaviors(itemId);
    return behaviors.checklist;
  }

  deleteList(itemId: string): void {
    store.db.dataset('ChecklistItems')
      .delete()
      .related('Checklists')
      .where(field => field('itemId').isEqualTo(itemId))
      .subscribe(() => {
        const behaviors = store.getBehaviors(itemId);
        behaviors.checklist = null;
        store.setBehaviors(itemId, behaviors);
      })
  }

  addListItem(itemId: string, checklistId: string, name: string): void {
    store.db.dataset('ChecklistItems')
      .insert({ checklistId, name })
      .subscribe((records) => {
        const behaviors = store.getBehaviors(itemId);
        behaviors.checklist.ChecklistItems = [
          ...behaviors.checklist.ChecklistItems,
          records[0]
        ];
        store.setBehaviors(itemId, behaviors);
      })
  }

  updateListItem(itemId: string, checklistItem: ChecklistItemType) {
    store.db.dataset('ChecklistItems')
      .update(checklistItem)
      .where(field => field('id').isEqualTo(checklistItem.id))
      .subscribe(() => {
        const behaviors = store.getBehaviors(itemId);
        const idx = behaviors.checklist.ChecklistItems.indexOf(checklistItem);
        behaviors.checklist.ChecklistItems[idx] = checklistItem;
        store.setBehaviors(itemId, behaviors);
      })
  }

  deleteListItem(itemId: string, checklistItem: ChecklistItemType) {
    store.db.dataset('ChecklistItems')
      .delete()
      .where(field => field('id').isEqualTo(checklistItem.id))
      .subscribe((records) => {
        const behaviors = store.getBehaviors(itemId);
        const idx = behaviors.checklist.ChecklistItems.indexOf(checklistItem);
        behaviors.checklist.ChecklistItems.splice(idx, 1);
        store.setBehaviors(itemId, behaviors);
      })
  }
}

export const ChecklistService = new ChecklistServiceController();

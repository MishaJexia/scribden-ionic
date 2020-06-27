import { ItemService } from '../services/item';
import { ItemType } from '../interfaces/item';

class TagServiceController {
    private getItem(itemId: number): ItemType {
        return ItemService.getItem(itemId);
    }

    createTags(item: ItemType): void {
        item.behaviors.tags = [];

        ItemService.updateItem(item);
    }

    getTags(itemId: number): Array<string> {
        let item: ItemType = this.getItem(itemId);

        return item && item.behaviors.tags;
    }

    updateTags(itemId: number, tags: Array<string>): void {
        let item: ItemType = this.getItem(itemId);
        item.behaviors.tags = tags;

        ItemService.updateItem(item);
    }

    deleteTags(itemId: number): void {
        let item: ItemType = this.getItem(itemId);
        delete item.behaviors.tags;

        ItemService.updateItem(item);
    }

    addTag(itemId: number, tag: string): boolean {
        let item: ItemType = this.getItem(itemId);
        
        if (!this.tagAlreadyExists(item, tag)) {
            item.behaviors.tags = [
                ...item.behaviors.tags,
                tag
            ];
            ItemService.updateItem(item);
            return true;
        } else {
            return false;
        }
    }

    updateTag(itemId: number, idx: number, tag: string): boolean {
        let item: ItemType = this.getItem(itemId);
        // do not allow duplicate tags
        if (!this.tagAlreadyExists(item, tag)) {
            item.behaviors.tags[idx] = tag;
            ItemService.updateItem(item);
            return true;
        } else {
            return false;
        }
    }

    deleteTag(itemId: number, tag: string): void {
        let item: ItemType = this.getItem(itemId);
        const tagToRemoveIdx = item.behaviors.tags.indexOf(tag);

        if (tagToRemoveIdx > -1) {
            item.behaviors.tags.splice(tagToRemoveIdx, 1);
            ItemService.updateItem(item);
        }
    }

    tagAlreadyExists(item: ItemType, tag: string): boolean {
        return item.behaviors.tags.reduce((acc, t) => acc || t === tag, false);
    }
}

export const TagService = new TagServiceController();

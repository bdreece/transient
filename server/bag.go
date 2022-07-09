package main

type BagItem[T any] struct {
	Count int
	Value *T
}

type Bag[T any] struct {
	store RadixTrie[BagItem[T]]
}

func NewBag[T any]() Bag[T] {
	return Bag[T]{
		store: NewRadixTrie[BagItem[T]](),
	}
}

func (b *Bag[T]) Push(key string, count int, value *T) {
	item := b.store.Get(key)
	if item == nil {
		b.store.Set(key, &BagItem[T]{
			Count: count,
			Value: value,
		})
	} else {
		item.Count += count
		if value != nil {
			item.Value = value
		}
	}
}

func (b *Bag[T]) Pop(key string) *T {
	item := b.store.Get(key)
	if item == nil {
		return nil
	}
	item.Count -= 1
	if item.Count == 0 {
		b.store.Del(key)
	}
	return item.Value
}

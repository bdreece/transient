package main

type BagItem[T any] struct {
	Count int
	Value T
}

type Bag[T any] struct {
	store RadixTrie[BagItem[T]]
}

func NewBag[T any]() Bag[T] {
	return Bag[T]{
		store: NewRadixTrie[BagItem[T]](),
	}
}

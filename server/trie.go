package main

import "strings"

type Node[T any] struct {
	Edges []Edge[T]
	Leaf  bool
	Value *T
}

func newNode[T any](leaf bool, value *T) Node[T] {
	return Node[T]{
		Edges: make([]Edge[T], 0),
		Leaf:  leaf,
		Value: value,
	}
}

func (n Node[T]) getNextEdgeExact(remaining string) *Edge[T] {
	for _, edge := range n.Edges {
		if strings.HasPrefix(remaining, edge.Label) {
			return &edge
		}
	}
	return nil
}

func (n Node[T]) getNextEdgeInexact(remaining string) *Edge[T] {
	for _, edge := range n.Edges {
		if strings.HasPrefix(remaining, string(edge.Label[0])) {
			return &edge
		}
	}
	return nil
}

type Edge[T any] struct {
	Label  string
	Target Node[T]
}

type RadixTrie[T any] struct {
	root Node[T]
}

func NewRadixTrie[T any]() RadixTrie[T] {
	return RadixTrie[T]{
		root: newNode[T](true, nil),
	}
}

func (t RadixTrie[T]) Get(key string) *T {
	elementsFound := 0
	cursor := &t.root
	for cursor != nil && !cursor.Leaf && elementsFound < len(key) {
		nextEdge := cursor.getNextEdgeExact(key[elementsFound:])
		if nextEdge != nil {
			cursor = &nextEdge.Target
			elementsFound += len(nextEdge.Label)
		} else {
			cursor = nil
		}
	}
	if cursor != nil && cursor.Leaf && elementsFound == len(key) {
		return cursor.Value
	} else {
		return nil
	}
}

func (t *RadixTrie[T]) Set(key string, val *T) {
	elementsFound := 0
	cursor := &t.root
	for cursor != nil && !cursor.Leaf && elementsFound < len(key) {
		nextEdge := cursor.getNextEdgeInexact(key[elementsFound:])
		if nextEdge != nil {
			if strings.HasPrefix(key[elementsFound:], nextEdge.Label) {
				cursor = &nextEdge.Target
				elementsFound += len(nextEdge.Label)
			} else {
				// TODO: split edge
			}
		} else {
			cursor = nil
		}
	}
}

func (t *RadixTrie[T]) Del(key string) *T {
	// TODO
	return nil
}

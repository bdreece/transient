package main

import "strings"

type Node[T any] struct {
	Edges []Edge[T]
	Leaf  bool
	Value *T
}

func newNode[T any](leaf bool, value *T) *Node[T] {
	return &Node[T]{
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
	Target *Node[T]
}

func newEdge[T any](label string, target *Node[T]) Edge[T] {
	return Edge[T]{
		Label:  label,
		Target: target,
	}
}

func (e *Edge[T]) branchEdge(remaining string) *Edge[T] {
	var i int
	for i = range e.Label {
		if e.Label[i] != remaining[i] {
			break
		}
	}

	trunkEdge := newEdge(e.Label[i:], e.Target)
	branchEdge := newEdge(remaining[i:], newNode[T](true, nil))

	newLabel := e.Label[:i]
	newTarget := newNode[T](false, nil)
	newTarget.Edges = append(newTarget.Edges, trunkEdge, branchEdge)

	e.Label = newLabel
	e.Target = newTarget
	return &branchEdge
}

type RadixTrieError struct {
	string
}

func (e RadixTrieError) Error() string {
	return e.string
}

type RadixTrie[T any] struct {
	root *Node[T]
}

func NewRadixTrie[T any]() RadixTrie[T] {
	return RadixTrie[T]{
		root: newNode[T](true, nil),
	}
}

func (t RadixTrie[T]) Get(key string) *T {
	elementsFound := 0
	cursor := t.root
	for cursor != nil && !cursor.Leaf && elementsFound < len(key) {
		nextEdge := cursor.getNextEdgeExact(key[elementsFound:])
		if nextEdge != nil {
			cursor = nextEdge.Target
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

// TODO: Branch on insert "box" when "boxer" exists
// TODO: Ensure insert "boxer" branches properly when "box" exists
func (t *RadixTrie[T]) Set(key string, val *T) error {
	elementsFound := 0
	cursor := t.root
	for !cursor.Leaf && elementsFound < len(key) {
		remaining := key[elementsFound:]
		nextEdge := cursor.getNextEdgeInexact(remaining)
		if nextEdge != nil {
			// Something matched
			if strings.HasPrefix(remaining, nextEdge.Label) {
				// Whole label matched, advance in trie
				cursor = nextEdge.Target
				elementsFound += len(nextEdge.Label)
			} else {
				// Some label matched, branch existing edge
				branchEdge := nextEdge.branchEdge(remaining)
				branchEdge.Target.Value = val
				return nil
			}
		} else {
			// Nothing matched, create new edge
			nextNode := newNode(true, val)
			cursor.Edges = append(cursor.Edges, newEdge(remaining, nextNode))
			return nil
		}
	}
	// Leaf node, replace existing value
	cursor.Value = val
	return nil
}

func (t *RadixTrie[T]) Del(key string) *T {
	// TODO
	return nil
}

package main

import "testing"

const (
	EXPECTED string = "expected %v, got %v\n"
)

func EmptyTrie() RadixTrie[int] {
	return NewRadixTrie[int]()
}

func OneTrie() RadixTrie[int] {
	trie := NewRadixTrie[int]()
	val := 1
	trie.Set("apple", &val)
	return trie
}

func ManyTrie() RadixTrie[int] {
	trie := NewRadixTrie[int]()
	vals := []int{1, 2, 3, 4, 5}
	keys := []string{"apple", "apricot", "banana", "carrot", "cucumber"}
	for i := range vals {
		trie.Set(keys[i], &vals[i])
	}
	return trie
}

func TestEmptyGet(t *testing.T) {
	trie := EmptyTrie()
	val := trie.Get("apple")
	if val != nil {
		t.Errorf(EXPECTED, nil, val)
	}
}

func TestOneGet(t *testing.T) {
	trie := OneTrie()
	val := trie.Get("apple")
	if val == nil {
		t.Errorf(EXPECTED, 1, val)
	}
}

func TestManyGet(t *testing.T) {
	trie := ManyTrie()
	val := trie.Get("cucumber")
	if val == nil {
		t.Errorf(EXPECTED, 5, val)
	}
}

func TestEmptySet(t *testing.T) {
	trie := EmptyTrie()
	val := 1
	trie.Set("apple", &val)
	newVal := trie.Get("apple")
	if newVal == nil || *newVal != val {
		t.Errorf(EXPECTED, val, newVal)
	}
}

func TestOneSet(t *testing.T) {
	trie := OneTrie()
	val := 2
	trie.Set("apricot", &val)
	newVal := trie.Get("apple")
	if newVal == nil || *newVal != val {
		t.Errorf(EXPECTED, val, newVal)
	}
}

func TestManySet(t *testing.T) {
	trie := ManyTrie()
	val := 10
	trie.Set("carrot", &val)
	newVal := trie.Get("carrot")
	if newVal == nil || *newVal != val {
		t.Errorf(EXPECTED, val, newVal)
	}

}

func TestBranchSet(t *testing.T) {

}

func TestExtendSet(t *testing.T) {

}

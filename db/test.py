Sort all items by height first
before sorting:
60, 100
56, 90, 60, 95
68 110 70
find the longest sequence
which contains increasing heights and increasing weights
o do this we
start at the beginning of the sequence
f the currently
learn about cells
research projects
explore our data
cells for your lab
videos & tutorials
site reorganized
public class Question
ArrayList items;
ArrayList lastFoundSeq;
ArrayList maxSeq;
int fillNextSeq
void findMaxSeq() {
    Collections.sort(items);
    int currentUnfit = 0;
    while (currentUnfit < items.size()) {
        ArrayList<HtWt> nextSeq = new Array;
        int nextUnfit = fillNextSeq(currentUnfit, nextSeq);
        maxSeq = seqWithMaxLength(maxSeq, nextSeq);
        if (nextUnfit == currentUnfit) break;
        else currentUnfit = nextUnfit;
    }
}







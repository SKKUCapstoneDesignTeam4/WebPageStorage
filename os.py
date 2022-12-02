
f = open("input.txt",'r')

pages_per_process,page_frame_num,window_size,reference_pages_length = [int(numeric_string) for numeric_string in f.readline().split()]

reference_pages = [int(numeric_string) for numeric_string in f.readline().split()]

f.close()



def MIN(ref, frame_size):
    def MIN_PUSH(memory, page):
        memory.append(page)
        return memory

    def MIN_POP(time, ref, memory, page):
        recently_used = [False for x in range(0,frame_size)]
        recently_used_counter = 0
        for i in range(time+1,len(ref)):
            for j in range(0,len(memory)):
                if memory[j] == ref[i]:
                    recently_used[j] = True
                    recently_used_counter += 1
            if recently_used_counter == page_frame_num-1:
                break
        for i in range(0,len(recently_used)):
            if recently_used[i] == False:
                memory.pop(i)
                break
        return memory

    def StorePage(time, ref, memory, page, fault_counter):
        if page not in memory:
            fault_counter += 1
            if len(memory) >= page_frame_num:
                memory = MIN_POP(time,ref,memory,page)
            memory = MIN_PUSH(memory, page)
        
        return memory, fault_counter

    page_fault_counter = 0
    memory = []
    time = 0
    print("MIN")
    for page in ref:
        memory, page_fault_counter = StorePage(time, ref, memory, page, page_fault_counter)
        print(time+1 ,"\t",memory)
        time += 1
    
    print("Page Fault: ", page_fault_counter)
    return

def LRU(ref, frame_size):
    def LRU_PUSH(memory, page):
        memory.append(page)
        return memory

    def LRU_POP(memory, page):
        memory.pop(0)
        return memory

    def StorePage(memory, page, fault_counter):
        if page not in memory:
            fault_counter += 1
            if len(memory) >= frame_size:
                memory = LRU_POP(memory,page)
            memory = LRU_PUSH(memory, page)
        return memory, fault_counter

    page_fault_counter = 0
    memory = []
    time = 0

    print("LRU")
    for page in ref:
        memory, page_fault_counter = StorePage(memory, page, page_fault_counter)
        print(time+1 ,"\t",memory)
        time = time+1

    print("Page Fault: ", page_fault_counter)
    return

def LFU(ref,frame_size):

    def LFU_PUSH(memory, page):
        memory['page'].append(page)
        memory['frequency'].append(0)
        return memory

    def LFU_POP(memory, page):
        min_idx = min(range(len(memory['frequency'])), key=memory['frequency'].__getitem__)
        memory['frequency'].pop(min_idx)
        memory['page'].pop(min_idx)
        return memory


    def StorePage(memory, page, fault_counter):
        if page not in memory['page']:
            fault_counter += 1
            if len(memory['page']) >= frame_size:
                memory = LFU_POP(memory, page)
            memory = LFU_PUSH(memory, page)
        
        else:
            memory['frequency'][memory['page'].index(page)]+= 1
        
        return memory, fault_counter


    page_fault_counter = 0
    memory = {"page":[],"frequency":[]}
    time = 0

    print("LFU")
    for page in ref:
        memory, page_fault_counter = StorePage(memory, page, page_fault_counter)
        print(time+1 ,"\t",memory)
        time = time+1
    print("Page Fault: ", page_fault_counter)
    return

def WS(ref,window_size):

    def LFU_PUSH(working_set, window, page):
        working_set.add(page)
        window.append(page)
        return working_set, window

    def LFU_POP(working_set, window, page):
        popped = window.pop(0)
        if popped not in window:
            working_set.remove(popped)
        return working_set, window


    def StorePage(time, working_set, window, page, fault_counter):
        if page not in working_set:
            fault_counter += 1

        if time >= 3:
            working_set, window = LFU_POP(working_set, window, page)
        working_set,window = LFU_PUSH(working_set, window, page)

        return working_set, window, fault_counter


    page_fault_counter = 0
    working_set = set()
    window = []
    time = 0


    print("WS")
    for page in ref:
        working_set, window, page_fault_counter = StorePage(time, working_set, window, page, page_fault_counter)
        print(time+1 ,"\t",working_set)
        time = time+1

    print("Page Fault: ", page_fault_counter)
    return
    
MIN(reference_pages, page_frame_num)
LRU(reference_pages, page_frame_num)
LFU(reference_pages, page_frame_num)
WS(reference_pages, window_size)

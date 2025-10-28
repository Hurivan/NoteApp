import { create } from 'zustand';

// Builder state store with undo/redo
export const useBuilderStore = create((set, get) => ({
  // Project info
  projectId: null,
  projectName: 'Untitled Project',
  
  // Book specs from config
  specs: {
    orientation: 'square_8x8',
    cover_type: 'hardcover',
    paper_type: 'matte',
    page_count: 40
  },
  
  // Spreads array
  spreads: [],
  
  // Current spread index
  currentSpreadIndex: 0,
  
  // Uploaded images
  uploadedImages: [],
  
  // View mode: 'overview' | 'spread' | 'preview'
  viewMode: 'spread',
  
  // Film strip visibility
  filmStripVisible: true,
  showOnlyUnused: false,
  
  // History for undo/redo
  history: [],
  historyIndex: -1,
  
  // Actions
  setProjectInfo: (id, name) => set({ projectId: id, projectName: name }),
  
  setSpecs: (specs) => set({ specs }),
  
  initializeSpreads: (pageCount) => {
    const spreadCount = Math.ceil(pageCount / 2);
    const newSpreads = [];
    for (let i = 0; i < spreadCount; i++) {
      newSpreads.push({
        id: `spread-${i}`,
        spreadNumber: i + 1,
        leftPage: {
          pageNumber: i * 2 + 1,
          layout: null,
          images: [],
          textBoxes: []
        },
        rightPage: {
          pageNumber: i * 2 + 2,
          layout: null,
          images: [],
          textBoxes: []
        }
      });
    }
    set({ spreads: newSpreads });
  },
  
  setCurrentSpread: (index) => set({ currentSpreadIndex: index }),
  
  updatePageLayout: (spreadIndex, side, layoutId) => {
    const spreads = [...get().spreads];
    const page = side === 'left' ? spreads[spreadIndex].leftPage : spreads[spreadIndex].rightPage;
    page.layout = layoutId;
    page.images = [];
    page.textBoxes = [];
    set({ spreads });
  },
  
  addImageToPlaceholder: (spreadIndex, side, placeholderIndex, imageId) => {
    const spreads = [...get().spreads];
    const page = side === 'left' ? spreads[spreadIndex].leftPage : spreads[spreadIndex].rightPage;
    if (!page.images) page.images = [];
    page.images[placeholderIndex] = imageId;
    set({ spreads });
  },
  
  removeImageFromPlaceholder: (spreadIndex, side, placeholderIndex) => {
    const spreads = [...get().spreads];
    const page = side === 'left' ? spreads[spreadIndex].leftPage : spreads[spreadIndex].rightPage;
    page.images[placeholderIndex] = null;
    set({ spreads });
  },
  
  addTextBox: (spreadIndex, side, textBox) => {
    const spreads = [...get().spreads];
    const page = side === 'left' ? spreads[spreadIndex].leftPage : spreads[spreadIndex].rightPage;
    if (!page.textBoxes) page.textBoxes = [];
    page.textBoxes.push({ id: Date.now(), text: '', ...textBox });
    set({ spreads });
  },
  
  updateTextBox: (spreadIndex, side, textBoxId, updates) => {
    const spreads = [...get().spreads];
    const page = side === 'left' ? spreads[spreadIndex].leftPage : spreads[spreadIndex].rightPage;
    const textBox = page.textBoxes.find(tb => tb.id === textBoxId);
    if (textBox) {
      Object.assign(textBox, updates);
    }
    set({ spreads });
  },
  
  uploadImages: (images) => {
    const newImages = images.map((img, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      url: img.url,
      name: img.name,
      used: false
    }));
    set({ uploadedImages: [...get().uploadedImages, ...newImages] });
  },
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  toggleFilmStrip: () => set({ filmStripVisible: !get().filmStripVisible }),
  
  toggleShowOnlyUnused: () => set({ showOnlyUnused: !get().showOnlyUnused }),
  
  reorderSpreads: (startIndex, endIndex) => {
    const spreads = [...get().spreads];
    const [removed] = spreads.splice(startIndex, 1);
    spreads.splice(endIndex, 0, removed);
    // Update spread numbers
    spreads.forEach((spread, idx) => {
      spread.spreadNumber = idx + 1;
      spread.leftPage.pageNumber = idx * 2 + 1;
      spread.rightPage.pageNumber = idx * 2 + 2;
    });
    set({ spreads });
  }
}));

import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  it('create an instance', () => {
    const pipe = new HighlightPipe();
    expect(pipe).toBeTruthy();
  });

  it('should highlight multiple search terms', () => {
    const pipe = new HighlightPipe();
    const value = 'This is a test string for highlighting multiple terms.';
    const searchTerms = ['test', 'highlighting', 'terms'];
    const result = pipe.transform(value, searchTerms);
    expect(result).toBe('This is a <span class="highlight">test</span> string for <span class="highlight">highlighting</span> multiple <span class="highlight">terms</span>.');
  });

  it('should return the original value if no search terms are provided', () => {
    const pipe = new HighlightPipe();
    const value = 'This is a test string with no search terms.';
    const result = pipe.transform(value, []);
    expect(result).toBe(value);
  });
});
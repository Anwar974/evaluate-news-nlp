import { handleSubmit, validateUrl } from './handleSubmit';

// Mocking fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      score_tag: 'positive',
      subjectivity: 'subjective',
      sentence_list: [{ text: 'This is a test sentence.' }]
    }),
  })
);

describe('handleSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <input id="articleUrl" value="http://example.com" />
      <div id="polarity"></div>
      <div id="subjectivity"></div>
      <div id="text"></div>
    `;
  });

  test('should make a POST request and update the UI', async () => {
    const event = { preventDefault: jest.fn() };
    await handleSubmit(event);

    expect(fetch).toHaveBeenCalledWith('http://localhost:8082/api', expect.any(Object));
    expect(fetch).toHaveBeenCalledTimes(1);

    // Verify UI updates
    expect(document.getElementById('polarity').innerHTML).toBe('Polarity: positive');
    expect(document.getElementById('subjectivity').innerHTML).toBe('Subjectivity: subjective');
    expect(document.getElementById('text').innerHTML).toBe('Text: This is a test sentence.');
  });

  test('should alert if the URL is invalid', () => {
    document.getElementById('articleUrl').value = 'invalid-url';
    const event = { preventDefault: jest.fn() };
    global.alert = jest.fn();

    handleSubmit(event);

    expect(global.alert).toHaveBeenCalledWith('Please enter a valid URL.');
  });
});

describe('validateUrl', () => {
  test('should validate correct URLs', () => {
    expect(validateUrl('http://example.com')).toBe(true);
    expect(validateUrl('https://example.com/path')).toBe(true);
    expect(validateUrl('http://sub.example.com')).toBe(true);
  });

  test('should invalidate incorrect URLs', () => {
    expect(validateUrl('htp://example.com')).toBe(false);
    expect(validateUrl('example.com')).toBe(false);
    expect(validateUrl('http://')).toBe(false);
  });
});

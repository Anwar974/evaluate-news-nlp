import { handleSubmit } from './index';
import './styles/main.scss';
import './styles/footer.scss';
import './styles/form.scss';
import './styles/header.scss';
import './styles/base.scss';

describe('Client-side JS', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="articleForm">
        <input id="articleUrl" value="http://example.com" />
        <button type="submit">Submit</button>
      </form>
      <div id="polarity"></div>
      <div id="subjectivity"></div>
      <div id="text"></div>
    `;

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
  });

  test('should make a POST request and update the UI', async () => {
    const event = { preventDefault: jest.fn() };
    await handleSubmit(event);

    expect(document.getElementById('polarity').textContent).toBe('Polarity: positive');
    expect(document.getElementById('subjectivity').textContent).toBe('Subjectivity: subjective');
    expect(document.getElementById('text').textContent).toBe('Text: This is a test sentence.');
  });

  test('should alert if the URL is invalid', () => {
    const invalidUrl = 'invalid_url';
    document.getElementById('articleUrl').value = invalidUrl;
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const event = { preventDefault: jest.fn() };

    handleSubmit(event);
    
    expect(alertMock).toHaveBeenCalledWith('Please enter a valid URL.');
    alertMock.mockRestore();
  });
});

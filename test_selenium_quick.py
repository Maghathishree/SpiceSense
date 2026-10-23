from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()
driver.get('http://localhost:5000/#!/login')
time.sleep(2)

# Interface test: verify key elements exist
email_input = driver.find_element(By.ID, 'email')
password_input = driver.find_element(By.ID, 'password')
login_btn = driver.find_element(By.ID, 'loginBtn')

assert email_input.is_displayed()
assert password_input.is_displayed()
assert 'Sign In' in login_btn.text

# Functional test: invalid login
email_input.clear()
email_input.send_keys('testuser@spicesense.in')
password_input.clear()
password_input.send_keys('wrong-password')
login_btn.click()
time.sleep(1)

error = driver.find_element(By.CLASS_NAME, 'error-message').text
assert 'Invalid email or password' in error

# Functional test: valid login
driver.get('http://localhost:5000/#!/login')
time.sleep(1)
email_input = driver.find_element(By.ID, 'email')
password_input = driver.find_element(By.ID, 'password')
login_btn = driver.find_element(By.ID, 'loginBtn')

email_input.clear()
email_input.send_keys('testchef@spicesense.in')
password_input.clear()
password_input.send_keys('correct-password')
login_btn.click()
time.sleep(2)

assert 'Dashboard' in driver.title or 'dashboard' in driver.current_url.lower()

driver.quit()
print('All test cases passed')

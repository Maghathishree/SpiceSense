"""
================================================================================
EX NO : 10 Performing Functional, Usability and Interface Testing using Selenium
PROJECT: SpiceSense - Smart South Indian Recipe & Nutrition Assistant
================================================================================
"""

import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5000/#!/login"

def run_tests():
    # Initialize Chrome WebDriver
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless') # Uncomment if running in headless mode
    driver = webdriver.Chrome(options=options)
    driver.maximize_window()

    try:
        # Navigate to Login Page
        driver.get(BASE_URL)
        wait = WebDriverWait(driver, 10)

        # Wait until the email input is loaded (AngularJS view rendered)
        email_input = wait.until(EC.visibility_of_element_located((By.ID, "email")))
        password_input = driver.find_element(By.ID, "password")
        login_btn = driver.find_element(By.ID, "loginBtn")

        # -------------------------------------------------------------
        # TEST 1: Interface Testing (Verify key elements exist & visible)
        # -------------------------------------------------------------
        assert driver.find_element(By.ID, "loginLogo").is_displayed(), "Logo should be visible"
        assert email_input.is_displayed(), "Email input should be visible"
        assert password_input.is_displayed(), "Password input should be visible"
        assert login_btn.is_displayed(), "Login button should be visible"
        print("Test 1: Interface testing PASSED")

        # -------------------------------------------------------------
        # TEST 2: Usability Testing (Check placeholders & button label)
        # -------------------------------------------------------------
        email_placeholder = email_input.get_attribute("placeholder")
        password_placeholder = password_input.get_attribute("placeholder")
        button_text = login_btn.text.strip()

        assert email_placeholder and len(email_placeholder) > 0, "Email placeholder missing"
        assert password_placeholder and len(password_placeholder) > 0, "Password placeholder missing"
        assert "Sign In" in button_text or "Login" in button_text, f"Unexpected button label: {button_text}"
        print("Test 2: Usability testing PASSED")

        # -------------------------------------------------------------
        # TEST 3: Negative Functional Test (Invalid login credentials)
        # -------------------------------------------------------------
        email_input.clear()
        email_input.send_keys("invalidchef@spicesense.in")
        password_input.clear()
        password_input.send_keys("wrongpassword")
        login_btn.click()

        # Wait for error message banner to appear
        error_element = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "error-message")))
        error_text = error_element.text.strip()

        assert "Invalid email or password" in error_text, f"Expected invalid login error, got: {error_text}"
        print("Test 3: Invalid login error PASSED")
        print(f"Displayed error: {error_text}")

        # -------------------------------------------------------------
        # TEST 4: Functional Test (Valid login & Dashboard redirect)
        # -------------------------------------------------------------
        # Refresh login page to reset form state
        driver.get(BASE_URL)
        email_input = wait.until(EC.visibility_of_element_located((By.ID, "email")))
        password_input = driver.find_element(By.ID, "password")
        login_btn = driver.find_element(By.ID, "loginBtn")

        email_input.clear()
        email_input.send_keys("testchef@spicesense.in")
        password_input.clear()
        password_input.send_keys("correct-password")
        login_btn.click()

        # Wait for redirect to /dashboard
        wait.until(lambda d: "dashboard" in d.current_url.lower() or "Dashboard" in d.title)
        time.sleep(1)

        assert "dashboard" in driver.current_url.lower() or "Dashboard" in driver.title, "User should reach Dashboard"
        print("Test 4: Valid login & Dashboard redirect PASSED")

        print("All test cases passed")

    finally:
        # Close the browser session
        time.sleep(1)
        driver.quit()

if __name__ == "__main__":
    run_tests()

#!/usr/bin/env python3
"""
Portfolio Backend API Testing Script
Tests the contact form submission and retrieval endpoints
"""

import requests
import json
import os
from datetime import datetime

# Get the base URL from environment
BASE_URL = "https://vibrant-nextjs.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def test_contact_submission_valid():
    """Test valid contact form submission"""
    print("\n=== Testing Valid Contact Submission ===")
    
    try:
        # Test data with realistic information
        test_data = {
            "name": "John Smith",
            "email": "john.smith@example.com",
            "message": "Hello! I'm interested in discussing a potential project collaboration. Could we schedule a call to discuss further?"
        }
        
        response = requests.post(f"{API_BASE}/contact", json=test_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('id'):
                print("✅ Valid contact submission test PASSED")
                return True, data.get('id')
            else:
                print("❌ Valid contact submission test FAILED - Missing success or id in response")
                return False, None
        else:
            print(f"❌ Valid contact submission test FAILED - Expected 200, got {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ Valid contact submission test FAILED - Exception: {str(e)}")
        return False, None

def test_contact_submission_missing_fields():
    """Test contact submission with missing required fields"""
    print("\n=== Testing Contact Submission with Missing Fields ===")
    
    test_cases = [
        {"name": "John Smith", "email": "john@example.com"},  # Missing message
        {"name": "John Smith", "message": "Hello there"},     # Missing email
        {"email": "john@example.com", "message": "Hello"},    # Missing name
        {}  # Missing all fields
    ]
    
    all_passed = True
    
    for i, test_data in enumerate(test_cases):
        try:
            print(f"\nTest case {i+1}: {test_data}")
            response = requests.post(f"{API_BASE}/contact", json=test_data)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data:
                    print(f"✅ Missing fields test case {i+1} PASSED")
                else:
                    print(f"❌ Missing fields test case {i+1} FAILED - No error message")
                    all_passed = False
            else:
                print(f"❌ Missing fields test case {i+1} FAILED - Expected 400, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ Missing fields test case {i+1} FAILED - Exception: {str(e)}")
            all_passed = False
    
    return all_passed

def test_contact_submission_invalid_email():
    """Test contact submission with invalid email format"""
    print("\n=== Testing Contact Submission with Invalid Email ===")
    
    invalid_emails = [
        "invalid-email",
        "test@",
        "@example.com",
        "test.example.com",
        "test@.com",
        "test@example"
    ]
    
    all_passed = True
    
    for email in invalid_emails:
        try:
            test_data = {
                "name": "John Smith",
                "email": email,
                "message": "Test message"
            }
            
            print(f"\nTesting invalid email: {email}")
            response = requests.post(f"{API_BASE}/contact", json=test_data)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 400:
                data = response.json()
                if 'error' in data and 'email' in data['error'].lower():
                    print(f"✅ Invalid email test for '{email}' PASSED")
                else:
                    print(f"❌ Invalid email test for '{email}' FAILED - No email error message")
                    all_passed = False
            else:
                print(f"❌ Invalid email test for '{email}' FAILED - Expected 400, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ Invalid email test for '{email}' FAILED - Exception: {str(e)}")
            all_passed = False
    
    return all_passed

def test_get_all_contacts():
    """Test retrieving all contacts"""
    print("\n=== Testing Get All Contacts ===")
    
    try:
        response = requests.get(f"{API_BASE}/contacts")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'contacts' in data:
                contacts = data['contacts']
                print(f"✅ Get contacts test PASSED - Retrieved {len(contacts)} contacts")
                
                # Verify sorting (should be by createdAt descending)
                if len(contacts) > 1:
                    for i in range(len(contacts) - 1):
                        if contacts[i].get('createdAt') < contacts[i+1].get('createdAt'):
                            print("❌ Contacts not properly sorted by createdAt descending")
                            return False
                    print("✅ Contacts properly sorted by createdAt descending")
                
                return True
            else:
                print("❌ Get contacts test FAILED - Missing success or contacts in response")
                return False
        else:
            print(f"❌ Get contacts test FAILED - Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Get contacts test FAILED - Exception: {str(e)}")
        return False

def test_invalid_endpoints():
    """Test invalid API endpoints"""
    print("\n=== Testing Invalid Endpoints ===")
    
    invalid_endpoints = [
        "/api/invalid",
        "/api/contact/invalid",
        "/api/contacts/invalid"
    ]
    
    all_passed = True
    
    for endpoint in invalid_endpoints:
        try:
            print(f"\nTesting invalid endpoint: {endpoint}")
            response = requests.get(f"{BASE_URL}{endpoint}")
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 404:
                print(f"✅ Invalid endpoint test for '{endpoint}' PASSED")
            else:
                print(f"❌ Invalid endpoint test for '{endpoint}' FAILED - Expected 404, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ Invalid endpoint test for '{endpoint}' FAILED - Exception: {str(e)}")
            all_passed = False
    
    return all_passed

def main():
    """Run all backend tests"""
    print("🚀 Starting Portfolio Backend API Tests")
    print(f"Testing API at: {API_BASE}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    test_results = {}
    
    # Test 1: Valid contact submission
    test_results['valid_submission'], contact_id = test_contact_submission_valid()
    
    # Test 2: Missing required fields
    test_results['missing_fields'] = test_contact_submission_missing_fields()
    
    # Test 3: Invalid email format
    test_results['invalid_email'] = test_contact_submission_invalid_email()
    
    # Test 4: Get all contacts
    test_results['get_contacts'] = test_get_all_contacts()
    
    # Test 5: Invalid endpoints
    test_results['invalid_endpoints'] = test_invalid_endpoints()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed_tests = sum(1 for result in test_results.values() if result)
    total_tests = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All tests PASSED! Portfolio backend API is working correctly.")
        return True
    else:
        print("⚠️  Some tests FAILED. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
const topics=[
 {name:"What is a percentage?",source:"A fraction whose denominator is 100 is called percent.",teach:[
 ["Imagine 100 little squares. If 25 are coloured, that is 25 out of 100 — or 25%.","25% means 25 of every 100. Think of a 100-square chocolate bar: colour 25 squares.","Percent means per hundred. Write a percentage as a fraction over 100: p% = p/100."],
 ["25% is one quarter. If 1 out of 4 equal parts is selected, that is 25%.","25/100 simplifies to 1/4. 50% = 1/2 and 75% = 3/4.","Convert percent to fraction by writing it over 100 and simplifying. To compare, express values in a common form."]
 ],method:["Percent means 'out of 100'.","The symbol % is read as 'percent'.","For example, 40% means 40/100." ]},
 {name:"Fractions to percentages",source:"To convert a fraction into percent, make its denominator 100. Multiply numerator and denominator by the same number.",teach:[
 ["A fraction is a part of a whole. To make it a percentage, ask: how many parts would it be out of 100?","Multiply the fraction by 100. For example, 3/4 = 75%.","Use (numerator ÷ denominator) × 100. To change p% to a fraction, write p/100 and simplify."],
 ["For 1/2, make 100 by multiplying top and bottom by 50: 50/100 = 50%.","For 3/5, multiply top and bottom by 20: 60/100 = 60%.","If the denominator does not divide 100 neatly, calculate numerator ÷ denominator × 100. Decimal answers may be approximate."]
 ],method:["To convert a fraction to percent: (fraction) × 100%.","To convert percent to fraction: write it over 100, then simplify.","Example: 45% = 45/100 = 9/20."]},
 {name:"Percentage of an amount",source:"Find a specific percent of a given amount by multiplying the amount by the percent and dividing by 100.",teach:[
 ["If you have 10 sweets and 50% are red, half are red: 5 sweets.","Find 10% by dividing by 10. Find 50% by halving. Find 25% by quartering.","Use amount × percent ÷ 100. Example: 15% of ₹1,500 = 1,500 × 15 ÷ 100 = ₹225."],
 ["25% means one quarter. So 25% of 240 = 240 ÷ 4 = 60.","Convert the percent to a fraction or multiply by the percent and divide by 100.","To find the whole when a part and its percent are known: whole = part × 100 ÷ percent."],
 ["Choose a shortcut when possible, or use amount × rate/100.","For reverse percentage, identify the known part and its rate before rearranging.","Check by calculating the percentage of your answer; it should return the given part."]
 ],method:["Write the amount.","Multiply by the percentage number.","Divide by 100."]},
 {name:"Percentage word problems",source:"The chapter uses percentage to compare a part with a whole, including marks and quantities.",teach:[
 ["If 2 out of 10 balloons are blue, 2/10 are blue. That is 20%.","Ask: what is the part? What is the whole? Then compare them.","Required percentage = (part ÷ whole) × 100."],
 ["Example: 45 rupees out of 75 rupees. 45 ÷ 75 × 100 = 60%.","Keep units the same when comparing quantities (kg with kg, rupees with rupees).","For marks: percentage = marks obtained ÷ maximum marks × 100."],
 ["Read the question and identify the unknown: part, whole, or percentage.","If percentage and part are known: whole = part × 100 ÷ percentage.","If whole and percentage are known: part = whole × percentage ÷ 100."]
 ],method:["Find the part and the whole.","Divide part by whole.","Multiply by 100 and include the % sign."]},
 {name:"Increase and decrease",source:"The chapter applies percentage to increases and reductions, including reverse comparisons.",teach:[
 ["A price goes up when it increases and goes down when it decreases.","10% of 100 is 10. A 10% increase makes 110; a 10% decrease makes 90.","New amount after increase = original × (100 + rate)/100. After decrease = original × (100 − rate)/100."],
 ["Start with 100. A 20% increase gives 120; a 20% decrease gives 80.","A percentage change is calculated using the original amount as the base.","For a reverse problem, undo the multiplier: original = new amount × 100 ÷ (100 ± rate)."],
 ["If x is 20% more than y, take y = 100, so x = 120. Then compare y with x: 100/120 × 100 = 83⅓%.","A 20% increase followed by a 20% decrease does not return to the starting value.","Write the base clearly. '20% of the original' and '20% of the new value' are different."]
 ],method:["Calculate the percentage change.","Add it to the original for an increase, or subtract for a decrease.","For reverse questions, divide by the appropriate multiplier."]},
 {name:"Profit and loss",source:"Cost price (CP), selling price (SP), overhead charges, profit/loss amount and percentages. Profit/loss percentage is based on cost price.",teach:[
 ["If you buy a toy for ₹10 and sell it for ₹12, you gain ₹2. That is profit.","If you buy for ₹10 and sell for ₹8, you lose ₹2. That is loss.","Profit = SP − CP. Loss = CP − SP."],
 ["Profit% = profit ÷ CP × 100. Loss% = loss ÷ CP × 100.","If CP is ₹100 and profit is 10%, SP is ₹110.","SP at profit = CP × (100 + profit%)/100. SP at loss = CP × (100 − loss%)/100."],
 ["Include overhead/repair charges in the effective cost where the problem requires it.","If SP and profit/loss rate are known, reverse the formula to find CP.","Check the base: profit and loss percentages are calculated on cost price, not selling price."]
 ],method:["Find CP and SP.","Compare: SP above CP = profit; SP below CP = loss.","Divide profit/loss by CP and multiply by 100."]},
 {name:"Discount",source:"Marked price is the printed price. Discount is the reduction. The amount paid is the selling price. Discount percentage is based on marked price.",teach:[
 ["A shop label says ₹100. The shop gives ₹10 off. You pay ₹90.","Marked price (MP) is the label price. Discount is the amount taken off. Selling price is what you pay.","Discount = MP − SP. Selling price = MP − discount."],
 ["15% off ₹1,200 means discount = ₹180, so the customer pays ₹1,020.","Discount% = discount ÷ marked price × 100.","Selling price after discount = MP × (100 − discount%)/100."],
 ["Example: MP ₹1,150 and SP ₹950. Discount = ₹200; discount% = 200/1,150 × 100 ≈ 17.4%.","The marked price is the base for discount percentage.","Check: marked price minus discount should equal selling price."]
 ],method:["Find marked price and selling price or discount rate.","Discount = marked price − selling price.","Discount% = discount ÷ marked price × 100."]}
];
const ageNames=["Little Explorer","Number Adventurer","Master Champion"];

/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/

// Study guide for this project - https://drive.google.com/file/d/1OD1diUsTMdpfMDv677TfL1xO2CEkykSz/view?usp=sharing


/**
 * global params
 */
var studentslist = document.querySelectorAll(".student-list .student-item")
const pagingIndicator = 10;



/**
 * `applyPaging` function
 * @param {*} list 
 * @param {*} paging 
 * 
 * refactored to use in one place from showPage calls
 */
const applyPaging = (list, paging) => {

   // open following to easily detect list length interacted with the page
   // console.log("List Length in interaction: ", list.length);

   const maxIncluded = paging * pagingIndicator;
   const minIncuded = (paging - 1) * pagingIndicator;

   for (let i = 0; i < list.length; i += 1) {
      if (i < maxIncluded && i >= minIncuded) {
         list[i].style.display = "block";
      } else {
         list[i].style.display = "none";
      }
   }

}


/**
 * 
 * @param {*} list 
 * @param {*} paging 
 * @param {*} filtered 
 * 
 * extended with filtered boolean param
 * shows students list item whether it's filtered or fully viewed
 */
const showPage = (list, paging, filtered) => {

   //function scope variables
   const page = document.querySelector('.page');
   const noItemSpan = document.querySelector('.noItemSpan');

   //clear if exists
   if (noItemSpan) {
      page.removeChild(noItemSpan);
   }

   //seperate handling for filtered list or paginated full list
   if (filtered) {

      if (list.length === 0) {

         const span = document.createElement('span');
         span.className = "noItemSpan";
         span.textContent = "No item(s) found";
         page.appendChild(span);

      }

      // start check algorithm for filtered
      //initally detecting the matches and sending them to paging
      var checked;
      var checkedArr = [];
      for (let i = 0; i < studentslist.length; i += 1) {
         checked = false;
         studentslist[i].style.display = "none";
         for (let v = 0; v < list.length; v += 1) {
            if (list[v] === studentslist[i]) {
               checked = true;
               break;
            }
         }
         if (checked) {
            studentslist[i].style.display = "block";
            checkedArr.push(studentslist[i]);
         }
      }
      applyPaging(list, paging);

   } else {
      //Start check algorithm for full list pagination
      applyPaging(list, paging);
   }

}



/**
 * `appendPageLinks` function
 * @param {*} list 
 * @param {*} filtered 
 * extended with filtered boolean param
 * appends pagination links with calculates results
 */

const appendPageLinks = (list, filtered) => {

   //determine page count
   const solidPages = Math.floor(list.length / pagingIndicator);
   let pageCount = (solidPages % pagingIndicator > 0) ? solidPages + 1 : (list.length > 0) ? solidPages + 1 : solidPages;

   //if filtered send to showPage with filtered param
   if (filtered) {
      // (pageCount === 0) ? 1 : pageCount
      showPage(list, 1, filtered);
   } else {
      if (pageCount > 0) {
         //initate with page 1 always
         showPage(list, 1);
      }
   }


   //select main page element
   const pageDivEl = document.querySelector(".page");

   //if previously created, reset the room to avoid creating same container again and again
   const paginationEl = document.querySelector('.pagination');
   if (paginationEl) {
      pageDivEl.removeChild(paginationEl);
   }

   //Create div
   const divEl = document.createElement('div');
   divEl.className = "pagination";

   //Create ul and append li with href tags appended already
   const ulEl = document.createElement('ul');
   for (let i = 1; i <= pageCount; i += 1) {
      const liEl = document.createElement('li');

      if (i === 1) {
         liEl.innerHTML = `<a class="active" href="#${i}">${i}</a>`;
      } else {
         liEl.innerHTML = `<a href="#${i}">${i}</a>`;
      }

      ulEl.appendChild(liEl);
   }



   //add event listener to pagination container
   //determine the clicked pagination with event-bubbling
   //call showPage with paging indicator
   divEl.addEventListener('click', (event) => {
      const el = event.target;
      const currentPage = el.textContent;
      showPage(list, +currentPage);


      //loop over only active links if any and clear them
      const activeLinks = document.querySelectorAll("li a.active");
      for (let i = 0; i < activeLinks.length; i += 1) {
         const activeEl = activeLinks[i];
         activeEl.className = "";
      }

      //finally add active class for the latest select paging indicator
      el.className = "active";
   })

   //final appending to be displayed in the html
   divEl.appendChild(ulEl);
   pageDivEl.appendChild(divEl);
}

const filteredStudents = (text) => {
   let retArr = [];
   for (let i = 0; i < studentslist.length; i += 1) {
      if (studentslist[i].firstElementChild.children[1].textContent.indexOf(text) > -1) {
         retArr.push(studentslist[i]);
      }
   }

   return retArr;
}

/**
 * `appendSearchComponent` function
 *  appends search div to the designed space
 */
const appendSearchComponent = () => {
   //Detect where to append
   const headerEl = document.querySelector(".page-header");

   //Create div, input and button
   const divEl = document.createElement('div');
   divEl.className = "student-search";
   const inputEl = document.createElement('input');
   inputEl.placeholder = "Search for students...";
   const buttonEl = document.createElement('button');
   buttonEl.textContent = "Search";

   //append all
   divEl.appendChild(inputEl);
   divEl.appendChild(buttonEl);
   headerEl.appendChild(divEl);

}



//calling functions when everything is ready and parsed
window.addEventListener('DOMContentLoaded', (event) => {
   appendPageLinks(studentslist);
   appendSearchComponent();

   //seperately handled for no reason. thought this way is more cleaner
   const button = document.getElementsByTagName('button')[0];
   const input = document.getElementsByTagName('input')[0];
   button.addEventListener('click', () => {
      if (input.value.length > 0) {
         const input = document.getElementsByTagName('input')[0];
         const filteredOnes = filteredStudents(input.value);
         appendPageLinks(filteredOnes, true);
      } else {
         appendPageLinks(studentslist);
      }

   });

   input.addEventListener('keyup', (e) => {
      if (e.target.value.length > 0) {
         const filteredOnes = filteredStudents(e.target.value);
         appendPageLinks(filteredOnes, true);
      } else {
         appendPageLinks(studentslist);
      }

   })


});

